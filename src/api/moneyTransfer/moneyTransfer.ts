import { Type } from 'class-transformer'

import { Account } from '../account/account'

export class MoneyTransfer {
  id: string

  sourceAccountId?: string | null
  @Type(() => Account)
  sourceAccount?: Account | null

  targetAccountId?: string | null
  @Type(() => Account)
  targetAccount?: Account | null

  increment: number
  decrement: number

  name?: string | null

  @Type(() => Date)
  date: Date

  @Type(() => Date)
  createdAt: Date
}
