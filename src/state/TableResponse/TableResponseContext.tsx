import { createContext, useState, ReactNode, Dispatch } from 'react'

import { noop } from '@/utils/constants'
import { TableResponse } from '@/utils/api.ts'

type TableResponseContextType = [TableResponse, Dispatch<TableResponse>]

export const initialTableResponse: TableResponse = {
  columns: [],
  rows: [],
}

const TableResponseContext = createContext<TableResponseContextType>([
  initialTableResponse,
  noop,
])

const TableResponseProvider = ({ children }: { children: ReactNode }) => {
  const [tableResponse, setTableResponse] =
    useState<TableResponse>(initialTableResponse)

  return (
    <TableResponseContext.Provider value={[tableResponse, setTableResponse]}>
      {children}
    </TableResponseContext.Provider>
  )
}

export { TableResponseContext, TableResponseProvider }
