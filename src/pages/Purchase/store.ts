import { runInAction } from 'mobx'

import purchasesApi from '../../api/purchase'
import { Purchase } from '../../api/purchase/purchase'
import { MobxStore, observableStore } from '../useMobx'

@observableStore
export class PurchaseStore extends MobxStore<[string]> {
  purchase: Purchase

  async loadPurchase(id: string) {
    const purchase = await purchasesApi.findOne(id)
    runInAction(() => {
      this.purchase = purchase
    })
  }

  async initialize([id]: [string]) {
    if (id && !this.purchase) this.loadPurchase(id)
    return
  }
}
