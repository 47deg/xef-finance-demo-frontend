import { createContext, useState, ReactNode, Dispatch } from 'react';

import { noop } from '@/utils/constants';

type TransactionsContextType = [
  Array<Transaction>,
  Dispatch<Array<Transaction>>,
];

const initialTransactions: Array<Transaction> = [];

const TransactionsContext = createContext<TransactionsContextType>([
  initialTransactions,
  noop,
]);

const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] =
    useState<Array<Transaction>>(initialTransactions);

  return (
    <TransactionsContext.Provider value={[transactions, setTransactions]}>
      {children}
    </TransactionsContext.Provider>
  );
};

export { TransactionsContext, TransactionsProvider };
