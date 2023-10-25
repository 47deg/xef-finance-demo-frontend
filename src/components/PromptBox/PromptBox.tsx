import {ChangeEvent, KeyboardEvent, useContext, useState} from 'react';
import {Button, TextField} from '@mui/material';
import {LoadingContext} from '@/state/Loading';
import {TransactionsContext} from '@/state/Transactions';
import { TableResponse } from '@/utils/api';
import styles from './PromptBox.module.css';
import {MessagesContext} from "@/state/Messages";
import {TableResponseContext} from "@/state/TableResponse";
import CSS from "csstype";
import {getTheme} from "@/utils/constants.ts";
import {formatCurrency} from "@/utils/strings.ts";
import {inferAI} from "@/utils/openai.ts";
import {GenericQuery, QueryResponse} from "@/utils/db.ts";

export function PromptBox() {
    const [transactions, setTransactions] = useContext(TransactionsContext);
    const [tableResponse, setTableResponse] = useContext(TableResponseContext);
    const [loading, setLoading] = useContext(LoadingContext);
    const [prompt, setPrompt] = useState<string>('');
    const [messages, setMessages] = useContext(MessagesContext);

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

                const userMessage: Message = {
                    text: trimmedInput,
                    type: 'user',
                };
                let msgs = [...messages, userMessage];
                setMessages(msgs);
                setPrompt('');

                const aiResponse = await inferAI(trimmedInput);

                let mainQueryResponse: QueryResponse = null;
                let detailedQueryResponse: QueryResponse = null;
                let tabularResponse: TableResponse = {
                    columns: ['Result'],
                    rows: [['Empty']]
                }
                let friendlyResponse: String;


                console.log("######################")
                console.log(aiResponse);

                // Main Query
                if(aiResponse.MainResponse.length > 0) {
                    mainQueryResponse = await GenericQuery(aiResponse.MainResponse);
                    console.log(mainQueryResponse)
                }

                //Friendly Response
                if(aiResponse.FriendlyResponse.includes("XXX") && mainQueryResponse) {
                    friendlyResponse = aiResponse.FriendlyResponse.replace("XXX", mainQueryResponse.tableResponse.rows[0][0]);
                } else {
                    friendlyResponse = aiResponse.FriendlyResponse;
                }

                // Detailed Query
                if(aiResponse.DetailedResponse && aiResponse.DetailedResponse.length > 0) {
                    detailedQueryResponse = await GenericQuery(aiResponse.DetailedResponse);
                    console.log(detailedQueryResponse);
                }

                //Tabular content
                if(detailedQueryResponse && mainQueryResponse) {
                    console.log("entra 1");
                    if(detailedQueryResponse.rowCount > mainQueryResponse.rowCount) {
                        console.log("entra 2");
                        tabularResponse = detailedQueryResponse.tableResponse
                    }
                    else {
                        console.log("entra 3");
                        tabularResponse = mainQueryResponse.tableResponse
                    }
                }
                else {
                    console.log("entra 4");
                    if(mainQueryResponse) {
                        console.log("entra 5");
                        tabularResponse = mainQueryResponse.tableResponse
                    }
                }

                let friendlyReplaced: string;

                if(response.valueName && response.value) {
                    let possibleValue: string = (response.valueName.includes("spent") || response.valueName.includes("amount")) ? formatCurrency(response.value, getTheme()) : response.value;
                    friendlyReplaced = response.answer.replace("XXX", possibleValue);
                }
                else {
                    friendlyReplaced = response.answer;
                }

                const systemMessage: Message = {
                    text: friendlyReplaced,
                    type: 'system',
                };

                setMessages([...msgs, systemMessage]);

                setTransactions([]);
                setTableResponse(tabularResponse);

                console.info(`Set transactions to AI request data`);
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
