import {ChangeEvent, useEffect, useContext, useRef} from 'react';
import {Box, Grid, IconButton, InputAdornment, TextField} from '@mui/material';
import {SendRounded} from '@mui/icons-material';
import {PromptBox} from '@/components/PromptBox';

import {LoadingContext} from '@/state/Loading';


import styles from './ChatBox.module.css';
import {MessagesContext} from "@/state/Messages";
import CircularProgress from "@mui/material/CircularProgress";

export function ChatBox() {

    const [messages, setMessages] = useContext(MessagesContext);
    const [loading, setLoading] = useContext(LoadingContext);


    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    return (
        <Box className={styles.container}>
            <Box className={styles.chat}>

                <div className={styles.messageContainer}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={styles.message + ' ' + (message.type === 'user' ? styles.userMessage : styles.systemMessage)}
                        >
                            {message.text}
                        </div>
                    ))}
                </div>

                {loading && (
                    <div
                        className={styles.loadingMessage}
                    >
                        <CircularProgress
                                size={20}
                                color="inherit"
                                thickness={8} />
                    </div>
                )}

                <div ref={messagesEndRef} />


            </Box>
            <Box className={styles.form}>
                <PromptBox/>
            </Box>
        </Box>
    );
}
