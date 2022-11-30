import { runInAction } from 'mobx'

import accountsApi from '../../api/account'
import { Account } from '../../api/account/account'
import { MobxStore, observableStore } from '../useMobx'

@observableStore
export class AccountsListStore extends MobxStore {
  accounts: Account[] = []

  get totalBalance() {
    return parseFloat(
      this.accounts
        .reduce((acc, account) => acc + account.currentValue, 0)
        .toFixed(2),
    )
  }

  async loadAccounts() {
    const accounts = await accountsApi.find()
    runInAction(() => {
      this.accounts = accounts
    })
  }

  async initialize() {
    await this.loadAccounts()
    return
  }
}
