import { runInAction } from 'mobx'

import moneyTransfersApi from '../../api/moneyTransfer'
import { MoneyTransfer } from '../../api/moneyTransfer/moneyTransfer'
import purchasesApi from '../../api/purchase'
import { Purchase } from '../../api/purchase/purchase'
import { MobxStore, observableStore } from '../useMobx'

@observableStore
export class TransferStore extends MobxStore<[string]> {
  transfer: MoneyTransfer

  async loadTransfer(id: string) {
    const transfer = await moneyTransfersApi.findOne(id)
    runInAction(() => {
      this.transfer = transfer
    })
  }

  async initialize([id]: [string]) {
    if (id && !this.transfer) this.loadTransfer(id)
    return
  }
}
