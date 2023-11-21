import {ChangeEvent, KeyboardEvent, useContext, useState} from 'react';
import {Button, TextField} from '@mui/material';
import {LoadingContext} from '@/state/Loading';
import {TransactionsContext} from '@/state/Transactions';
import { TableResponse } from '@/utils/api';
import styles from './PromptBox.module.css';
import {TableResponseContext} from "@/state/TableResponse";
import * as CSS from 'csstype'
import {
    AssistantMessage,
    MessagesContext,
    UserMessage,
} from '@/state/Messages'
import {getTheme} from "@/utils/constants.ts";
import {formatCurrency} from "@/utils/strings.ts";
import {inferAI} from "@/utils/openai.ts";
import {GenericQuery, QueryResponse} from "@/utils/db.ts";

export function PromptBox() {
    const [, setTransactions] = useContext(TransactionsContext)
    const [, setTableResponse] = useContext(TableResponseContext)
    const [loading, setLoading] = useContext(LoadingContext);
    const [prompt, setPrompt] = useState<string>('');
    const [messages, addMessage] = useContext(MessagesContext);

    const buttonStyles: CSS.Properties = {
        backgroundColor: getTheme().colorOne,
    };

    const handleInput = async () => {
        if (!loading) {
            try {
                setLoading(true);
                console.group(`💬 Prompt from input:`);

                const trimmedInput = prompt?.trim() || '';

                console.info(`👤 ${trimmedInput}`);

                const userMessage: UserMessage = {
                    content: trimmedInput,
                    role: 'user',
                }
                addMessage(userMessage)
                setPrompt('');

                const ingestable = messages
                    .filter(
                        (m): m is UserMessage | AssistantMessage =>
                            m.role === 'assistant' || m.role === 'user',
                    )
                    .map(m => {
                        if (m.role === 'assistant')
                            return { role: m.role, content: m.original }
                        return { role: m.role, content: m.content }
                    })


                const aiResponse = await inferAI(userMessage, ...ingestable)
                console.debug(aiResponse)

                if ('error' in aiResponse) throw new Error(aiResponse.error)

                let mainQueryResponse: QueryResponse = null;
                let detailedQueryResponse: QueryResponse = null;
                let tabularResponse: TableResponse = {
                    columns: ['Result'],
                    rows: [['Empty']]
                }
                let friendlyResponse: string;

                // Main Query
                if(aiResponse.MainResponse.length > 0) {
                    mainQueryResponse = await GenericQuery(aiResponse.MainResponse);
                }

                //Friendly Response
                if(aiResponse.FriendlyResponse.includes("XXX") && mainQueryResponse) {

                    let words: string[] = ['spent', 'amount', 'expenses', 'balance', 'paycheck', 'salary'];

                    if(mainQueryResponse.tableResponse.columns[0] && mainQueryResponse.tableResponse.rows[0][0]) {
                        let possibleValue: string = (words.some(_w => mainQueryResponse.tableResponse.columns[0]) && !mainQueryResponse.tableResponse.columns[0].includes('count')) ? formatCurrency(mainQueryResponse.tableResponse.rows[0][0], getTheme()) : mainQueryResponse.tableResponse.rows[0][0];
                        friendlyResponse = aiResponse.FriendlyResponse.replace("XXX", possibleValue);
                    }
                    else {
                        friendlyResponse = aiResponse.FriendlyResponse;
                    }

                } else {
                    friendlyResponse = aiResponse.FriendlyResponse;
                }

                // Detailed Query
                if(aiResponse.DetailedResponse && aiResponse.DetailedResponse.length > 0) {
                    detailedQueryResponse = await GenericQuery(aiResponse.DetailedResponse);
                }

                //Tabular content
                if(detailedQueryResponse && mainQueryResponse) {
                    console.log('1');
                    if(detailedQueryResponse.rowCount > mainQueryResponse.rowCount) {
                        console.log('2');
                        tabularResponse = detailedQueryResponse.tableResponse
                        // tabularResponse = mainQueryResponse.tableResponse
                    }
                    else {
                        console.log('3');
                        // tabularResponse = mainQueryResponse.tableResponse
                        tabularResponse = detailedQueryResponse.tableResponse
                    }
                }
                else {
                    console.log('4');
                    if(mainQueryResponse) {
                        console.log('5');
                        tabularResponse = mainQueryResponse.tableResponse
                    }
                }



                addMessage({
                    content: friendlyResponse,
                    role: 'assistant',
                    original: aiResponse.original,
                })

                setTransactions([]);
                setTableResponse(tabularResponse);

                console.info(`Set transactions to AI request data`);
            } catch (e: unknown) {
                if (e instanceof Error) addMessage({ role: 'system', error: e })
                else {
                    addMessage({
                        role: 'system',
                        error: new Error('An unkown error has occurred.'),
                    })
                }
            } finally {

                console.groupEnd();
                setLoading(false);
            }
        }
    };

    const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleInput();
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPrompt(event.target.value);
    };

    return (
        <>
            <TextField
                id="prompt-input"
                placeholder="Ask a question"
                hiddenLabel
                multiline
                maxRows={4}
                value={prompt}
                onChange={handleChange}
                onKeyDown={handleKey}
                disabled={loading}
                inputProps={{
                    cols: 100,
                    disableunderline: "true",
                }}
                sx={{
                    "& fieldset": {border: 'none'},
                    '& .MuiInputBase-root': {
                        padding: 0.4,
                        fontSize: 14,
                        color: '#666',
                    },
                }}
            />
            <Button className={styles.sendbutton} style={buttonStyles}  onClick={handleInput}>
                SEND
            </Button>
        </>
    );
}
