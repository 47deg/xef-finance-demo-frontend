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
import {inferAI} from "@/utils/openai.ts";

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
                let a = [...messages, userMessage];
                setMessages(a);
                setPrompt('');

                const aver = await inferAI(trimmedInput);
                console.log(aver);
                const emptyTableResponse: TableResponse = {
                    columns: [],
                    rows: []
                }

                const systemMessage: Message = {
                    text: aver.FriendlyResponse,
                    type: 'system',
                };

                setMessages([...a, systemMessage]);

                setTransactions([]);
                setTableResponse(emptyTableResponse);

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
