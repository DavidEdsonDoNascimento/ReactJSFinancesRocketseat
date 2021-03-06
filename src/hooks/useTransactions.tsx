import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'
import { Transaction, TransactionInput } from '../types/Transaction'

type TransactionsProviderProps = {
    children: ReactNode
}

type TransactionContextProps = {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionContextProps>({} as TransactionContextProps)

export const TransactionsProvider = ({ children }: TransactionsProviderProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    async function loadAllTransactions() {
        const result = await api('transactions')
        setTransactions(result.data.transactions)
    }

    const createTransaction = async (transactionInput: TransactionInput) => {
        const result = await api.post('/transactions', { ...transactionInput, createdAt: new Date() });
        const { transaction } = result.data;
        setTransactions([...transactions, transaction]);
    }

    useEffect(() => {
        loadAllTransactions()
    }, [])

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export const useTransactions = () => {
    const context = useContext(TransactionsContext);
    return context;
}