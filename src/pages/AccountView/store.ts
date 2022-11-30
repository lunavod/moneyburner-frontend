import { orderBy } from 'lodash-es'
import { DateTime, Interval } from 'luxon'
import { runInAction } from 'mobx'

import accountsApi from '../../api/account'
import { Account } from '../../api/account/account'
import moneyTransfersApi from '../../api/moneyTransfer'
import { MoneyTransfer } from '../../api/moneyTransfer/moneyTransfer'
import purchasesApi from '../../api/purchase'
import { Purchase } from '../../api/purchase/purchase'
import { MobxStore, observableStore } from '../useMobx'

@observableStore
export class AccountViewStore extends MobxStore<[string]> {
  account: Account
  purchases: Purchase[] = []
  transfers: MoneyTransfer[] = []

  selectedAction: { type: 'purchase' | 'transfer'; id: string } | null = null

  setSelectedAction(
    data: { type: 'purchase' | 'transfer'; id: string } | null,
  ) {
    this.selectedAction = data
  }

  get timeUntilReset() {
    const resetDay = this.account?.limitStartDate
    if (!resetDay) return null

    const day = DateTime.now().get('day')
    if (day < resetDay) return resetDay - day

    const resetDate = DateTime.now().set({
      day: resetDay,
      month: DateTime.now().get('month') + 1,
    })
    return (
      Interval.fromDateTimes(
        DateTime.now().startOf('day'),
        resetDate.startOf('day'),
      ).length('days') - 1
    )
  }

  get symbol() {
    return this.account.currency?.symbol ?? this.account.currency?.code ?? ''
  }

  get actions() {
    return orderBy(
      [...this.purchases, ...this.transfers],
      [(d) => d.date ?? d.createdAt],
      ['desc'],
    )
  }

  async initialize([id]: [string], preloaded?: boolean | undefined) {
    const account = await accountsApi.findOne(id)

    const purchases = await purchasesApi.find()
    const transfers = await moneyTransfersApi.find()

    runInAction(() => {
      this.account = account
      this.purchases = purchases.filter((p) => p.accountId === account.id)
      this.transfers = transfers.filter(
        (t) =>
          t.sourceAccountId === account.id || t.targetAccountId === account.id,
      )
    })
  }
}
