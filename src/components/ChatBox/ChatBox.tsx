import { useEffect, useContext, useRef } from 'react'
import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import CSS from 'csstype'
import classnames from 'classnames'

import { PromptBox } from '@/components/PromptBox'
import { LoadingContext } from '@/state/Loading'
import { MessagesContext } from '@/state/Messages'
import { getTheme } from '@/utils/constants.ts'
import styles from './ChatBox.module.scss'

export function ChatBox() {
  const [messages] = useContext(MessagesContext)
  const [loading] = useContext(LoadingContext)

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(scrollToBottom, [messages])

  const messageUserStyles: CSS.Properties = {
    backgroundColor: getTheme().colorOne,
  }

  const messageBotStyles: CSS.Properties = {}

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
                [styles.errorMessage]: 'error' in message,
              })}
              style={
                message.role === 'user' ? messageUserStyles : messageBotStyles
              }>
              {message.content}
            </div>
          ))}
        </div>

        {loading && (
          <div className={styles.loadingMessage}>
            <CircularProgress size={20} color="inherit" thickness={8} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </Box>
      <Box className={styles.form}>
        <PromptBox />
      </Box>
    </Box>
  )
}
