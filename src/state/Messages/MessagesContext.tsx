import { createContext, useState, ReactNode, Dispatch } from 'react'

import { noop } from '@/utils/constants'

type MessagesContextType = [Array<Message>, Dispatch<Array<Message>>]

const m1: Message = {
  text: '🤖 Hi! This is your Personal Finance Manager. How can I help you today?',
  type: 'system',
}

const initialMessages = [m1]

const MessagesContext = createContext<MessagesContextType>([
  initialMessages,
  noop,
])

const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Array<Message>>(initialMessages)

  return (
    <MessagesContext.Provider value={[messages, setMessages]}>
      {children}
    </MessagesContext.Provider>
  )
}

export { MessagesContext, MessagesProvider }
