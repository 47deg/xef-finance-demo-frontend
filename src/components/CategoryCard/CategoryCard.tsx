import {
  Box,
  Button,
  Card,
  CardHeader,
  Avatar,
  LinearProgress,
} from '@mui/material'
import CSS from 'csstype'
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined'
import * as myIcons from '@mui/icons-material'
import { useContext } from 'react'
import {
  AttachMoneyOutlined,
  ConstructionOutlined,
  SvgIconComponent,
} from '@mui/icons-material'

import styles from '@/components/CategoryCard/CategoryCard.module.css'

import { TransactionsContext } from '@/state/Transactions'
import { LoadingContext } from '@/state/Loading'
import {
  initialTableResponse,
  TableResponseContext,
} from '@/state/TableResponse'

import { TransactionsResponse } from '@/utils/api.ts'
import { getTheme } from '@/utils/constants.ts'
import { formatCurrency } from '@/utils/strings.ts'
import { TransactionsPerCategory } from '@/utils/db.ts'

interface CategoryCardProps {
  category: Category
}

export const icons = new Map<string, JSX.Element>([
  ['MAINTENANCE', <myIcons.ConstructionOutlined />],
  ['VEHICLE RUNNING EXPENSES', <myIcons.CarRepairOutlined />],
  ['ENTERTAINMENT/SHOPPING/LIFESTYLE', <myIcons.SportsEsportsOutlined />],
  ['BUSINESS PL', <myIcons.BusinessCenterOutlined />],
  ['LOAN', <myIcons.CreditScoreOutlined />],
  ['UTILITIES', <myIcons.ReceiptLongOutlined />],
  ['RENT', <myIcons.AddHomeWorkOutlined />],
  ['CASH DEPOSIT', <myIcons.PaymentsOutlined />],
  ['INSURANCE', <myIcons.HealthAndSafetyOutlined />],
  ['EDUCATION', <myIcons.SchoolOutlined />],
  ['DINING', <myIcons.FlatwareOutlined />],
  ['LIQUOR', <myIcons.LiquorOutlined />],
  ['INVESTMENT', <myIcons.WaterfallChartOutlined />],
  ['TRAVEL AND HOSPITALITY', <myIcons.TravelExploreOutlined />],
  ['LOGISTICS', <myIcons.InventoryOutlined />],
  ['CASH WITHDRAWALS', <myIcons.PaymentsOutlined />],
  ['DOMESTIC EXPENSES', <myIcons.WaterDamageOutlined />],
  ['CREDIT CARD PAYMENTS', <myIcons.CardMembershipOutlined />],
  ['PERSONAL TRANSFERS', <myIcons.TransferWithinAStationOutlined />],
  ['DOWNPAYMENTS', <myIcons.ReceiptOutlined />],
  ['FEE', <myIcons.RequestQuoteOutlined />],
  ['BANK CHARGES', <myIcons.AccountBalanceOutlined />],
  ['BROKERAGE', <myIcons.SsidChartOutlined />],
  ['INCOME/EXPENSE', <myIcons.MoneyOutlined />],
])

export const cat1Titles = new Map<string, string>([
  ['VEHICLE RUNNING EXPENSES', 'VEHICLE EXPENSES'],
  ['ENTERTAINMENT/SHOPPING/LIFESTYLE', 'LIFESTYLE'],
  ['TRAVEL AND HOSPITALITY', 'TRAVEL'],
  ['CASH WITHDRAWALS', 'WITHDRAWALS'],
  ['CREDIT CARD PAYMENTS', 'CC Payments'],
])

const iconStyles: CSS.Properties = {
  color: getTheme().colorOne,
}

const iconProps = {
  className: styles.icon,
  style: iconStyles,
}

export function AddExtraProps(Component, extraProps) {
  return <Component.type {...Component.props} {...extraProps} />
}

export function getIcon(s: string): JSX.Element {
  let maybeIcon = icons.get(s)
  const icon = (maybeIcon ??= <myIcons.AttachMoneyOutlined />)
  return AddExtraProps(icon, iconProps)
}

export function getCat1Title(s: string) {
  let maybeTitle = cat1Titles.get(s)
  // console.log(s);
  const otro = (maybeTitle ??= s)
  return (maybeTitle ??= s)
}

function CategoryCard(props: CategoryCardProps) {
  // console.log(getTheme());

  const [_, setTransactions] = useContext(TransactionsContext)
  const [tableResponse, setTableResponse] = useContext(TableResponseContext)
  const [loading, setLoading] = useContext(LoadingContext)

  const handleClick = async (categoryName: string) => {
    if (!loading) {
      try {
        setLoading(true)
        console.group(`🖱️ ${categoryName} category button clicked:`)

        const dbResult: Transaction[] =
          await TransactionsPerCategory(categoryName)

        setTableResponse(initialTableResponse)
        setTransactions(dbResult)

        console.info(`Set transactions to category request data`)
      } finally {
        console.groupEnd()
        setLoading(false)
      }
    }
  }

  const amount = props.category.totalAmount * -1
  return (
    <Card key={`cat-${props.category.name}`} className={styles.card}>
      <CardHeader
        className={styles.cardHeader}
        onClick={event => {
          handleClick(props.category.name)
        }}
        sx={{
          '& .MuiCardHeader-avatar': { marginRight: 0.8 },
          '& .MuiCardHeader-title': {
            fontSize: 12,
            fontWeight: 500,
            color: '#999',
          },
          '& .MuiCardHeader-subheader': {
            fontSize: 13,
            fontWeight: 700,
            color: '#666',
          },
        }}
        avatar={getIcon(props.category.name)}
        title={getCat1Title(props.category.name)}
        subheader={
          <>
            <p className={styles.amount}>{`${formatCurrency(
              amount,
              getTheme(),
            )}`}</p>
            <LinearProgress
              value={25}
              variant="determinate"
              color={'inherit'}
              sx={{
                '& .MuiLinearProgress-barColorInherit': {
                  backgroundColor: getTheme().colorTwo,
                },
              }}
            />
          </>
        }
      />
    </Card>
  )
}

export default CategoryCard
