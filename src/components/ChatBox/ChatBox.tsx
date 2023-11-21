import {ChangeEvent, useEffect, useContext, useRef} from 'react';
import {Box, Grid, IconButton, InputAdornment, TextField} from '@mui/material';
import {SendRounded} from '@mui/icons-material';
import {PromptBox} from '@/components/PromptBox';

import {LoadingContext} from '@/state/Loading';


import styles from './ChatBox.module.css';
import {MessagesContext} from "@/state/Messages";
import CircularProgress from "@mui/material/CircularProgress";
import * as CSS from 'csstype'
import classnames from 'classnames'
import {getTheme} from "@/utils/constants.ts";

export function ChatBox() {

    const [messages] = useContext(MessagesContext)
    const [loading] = useContext(LoadingContext)


    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const messageUserStyles: CSS.Properties = {
        backgroundColor: getTheme().colorOne,
    };

    const messageBotStyles: CSS.Properties = {};

    return (
        <Box className={styles.container}>
            <Box className={styles.chat}>

                <div className={styles.messageContainer}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={classnames({
                                [styles.message]: true,
                                [styles.userMessage]: message.role === 'user',
                                [styles.systemMessage]: message.role === 'system',
                                [styles.assistantMessage]: message.role === 'assistant',
                                [styles.error]: 'error' in message,
                            })}
                            style={
                                message.role === 'user' ? messageUserStyles : messageBotStyles
                            }>
                            {'content' in message ? message.content : message.error.message}
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
