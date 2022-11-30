import { Type } from 'class-transformer'

import { Currency } from '../currency/currency'

export class Account {
  id: string

  name: string
  userId: string
  currentValue: number

  creditLimit?: number
  limitStartDate?: number
  limitUsed?: number

  leumiCardNumber?: string
  type: AccountType

  currencyId: string
  @Type(() => Currency)
  currency?: Currency

  @Type(() => Date)
  createdAt: Date
}

export type AccountType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'
