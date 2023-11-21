import { createContext, useState, ReactNode, Dispatch } from 'react';

import { noop } from '@/utils/constants';

export type AssistantMessage = {
  role: 'assistant'
  content: string
  original: string
}

export type UserMessage = {
  role: 'user'
  content: string
}

export type ErrorMessage = { error: Error }
export type SystemMessage = { role: 'system' } & ErrorMessage

export type Message = AssistantMessage | UserMessage | SystemMessage

export type MessagesContextType = [Array<Message>, Dispatch<Message>]


let m1: Message = {
  content:
      'Hi! This is your Personal Finance Manager. How can I help you today?',
  role: 'assistant',
  original:
      'Hi! This is your Personal Finance Manager. How can I help you today?',
};

const initialMessages = [m1];

const MessagesContext = createContext<MessagesContextType>([
  initialMessages,
  noop,
]);

const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] =
    useState<Array<Message>>(initialMessages);

  const addMessage = (message: Message) => {
    setMessages(messages => [...messages, message])
  }

  return (
    <MessagesContext.Provider value={[messages, addMessage]}>
      {children}
    </MessagesContext.Provider>
  );
};

export { MessagesContext, MessagesProvider };
