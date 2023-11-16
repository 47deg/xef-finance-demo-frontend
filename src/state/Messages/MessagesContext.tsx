import { createContext, useState, ReactNode, Dispatch } from 'react'

import { noop } from '@/utils/constants'

type MessagesContextType = [Array<Message>, Dispatch<Message>]

const m1: Message = {
  content:
    '🤖 Hi! This is your Personal Finance Manager. How can I help you today?',
  role: 'system',
}

const initialMessages = [m1]

const MessagesContext = createContext<MessagesContextType>([
  initialMessages,
  noop,
])

const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Array<Message>>(initialMessages)
  const addMessage = (message: Message) => {
    setMessages(messages => [...messages, message])
  }

  return (
    <MessagesContext.Provider value={[messages, addMessage]}>
      {children}
    </MessagesContext.Provider>
  )
}

export { MessagesContext, MessagesProvider }
