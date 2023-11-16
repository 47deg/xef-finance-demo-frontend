import { useContext } from 'react'
import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {
  AttachMoneyOutlined,
  ConstructionOutlined,
  SvgIconComponent,
} from '@mui/icons-material'
import * as myIcons from '@mui/icons-material'

import { getCat1Title, icons, AddExtraProps } from '@/components/CategoryCard'

import { TransactionsContext } from '@/state/Transactions'
import { TableResponseContext } from '@/state/TableResponse'

import {
  dateNicely,
  formatCurrency,
  toCapitalizedSpaceCase,
  toSnakeCase,
  toSpaceCase,
} from '@/utils/strings'
import { TableResponse } from '@/utils/api.ts'
import { getTheme } from '@/utils/constants.ts'

import styles from './TxnGrid.module.css'

const minWidth = 100

const iconProps = {
  className: styles.icon,
}

function getIcon(s: string): JSX.Element {
  let maybeIcon = icons.get(s)
  const icon = (maybeIcon ??= <AttachMoneyOutlined />)
  return AddExtraProps(icon, iconProps)
}

const txnColumns: GridColDef[] = [
  {
    field: 'category1',
    headerName: 'Category',
    flex: 0.8,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams<any, string>) => (
      <>
        {getIcon(params.value)}
        <span>{toCapitalizedSpaceCase(params.row.category2)}</span>
      </>
    ),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    valueGetter: params => {
      if (!params.value) {
        return params.value
      }

      return typeof params.value.getMonth === 'function'
        ? dateNicely(params.value as Date)
        : (params.value as string)
    },
  },
  {
    field: 'transaction_details',
    headerName: 'Details',
    flex: 1,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams<any, string>) => (
      <strong>{params.value}</strong>
    ),
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 100,
    valueGetter: params => {
      if (!params.value) {
        return params.value
      }
      const str = params.value.toString()

      if (str.includes('$')) {
        return str
      } else {
        return formatCurrency(params.value, getTheme())
      }
    },
  },
  { field: 'city', headerName: 'Location', flex: 0.5, minWidth: 100 },
  { field: 'carbon', headerName: 'Carbon', width: 100 },
]

function createNewColumns(newColumns: string[]): GridColDef[] {
  const flexPerc: number = newColumns.length > 0 ? 1 / newColumns.length : 1
  const nc: GridColDef[] = newColumns.map(newColumn => {
    const gcd: GridColDef = {
      field: newColumn,
      headerName: toCapitalizedSpaceCase(newColumn),
      flex: flexPerc,
      minWidth: 150,
    }
    return gcd
  })
  return nc
}

export function TxnGrid() {
  const [tableResponse] = useContext(TableResponseContext)
  const [transactions] = useContext(TransactionsContext)

  function genObjects(table: TableResponse) {
    return table.rows.map((r, i) => genObject(table.columns, r, i))
  }

  function genObject(c: string[], p: string[], id: number) {
    const obj = {}
    const aa = Array(c.length).fill(0)
    aa.map((_, i) => (obj[c[i]] = p[i]))
    obj['id'] = id
    return obj
  }

  const c: GridColDef[] =
    tableResponse.columns.length == 11
      ? txnColumns
      : createNewColumns(tableResponse.columns)

  // console.log(c);

  return (
    <Box className={styles.container}>
      {!!(tableResponse.columns && tableResponse.columns.length) && (
        <DataGrid
          rows={genObjects(tableResponse)}
          columns={c}
          density="standard"
          sx={{
            marginLeft: 2,
            marginRight: 2,
            boxShadow: 0,
            border: 0,
            '& .MuiDataGrid-cell': {
              color: '#777777',
              fontWeight: 400,
            },
          }}
        />
      )}
      {!!(
        transactions &&
        transactions.length &&
        tableResponse.columns.length == 0
      ) && (
        <DataGrid
          rows={transactions}
          columns={txnColumns}
          density="standard"
          sx={{
            marginLeft: 2,
            marginRight: 2,
            boxShadow: 0,
            border: 0,
            '& .MuiDataGrid-cell': {
              color: '#777777',
              fontWeight: 400,
            },
          }}
        />
      )}
    </Box>
  )
}
