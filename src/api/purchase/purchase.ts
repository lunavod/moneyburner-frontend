import { Type } from 'class-transformer'

import { Account } from '../account/account'
import { Store } from '../store/store'

export class Purchase {
  id: string

  storeId: string
  @Type(() => Store)
  store?: Store

  accountId: string
  @Type(() => Account)
  account?: Account

  value: number

  @Type(() => Date)
  date: Date

  @Type(() => Date)
  createdAt: Date
}
