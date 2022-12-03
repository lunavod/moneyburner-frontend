import { runInAction } from 'mobx'

import purchasesApi from '../../api/purchase'
import { Purchase } from '../../api/purchase/purchase'
import storesApi from '../../api/store'
import { Store } from '../../api/store/store'
import FormState from '../../utils/form'
import { MobxStore, observableStore } from '../useMobx'

export type StoreForm = {
  name: string
  alias: string
}

@observableStore
export class StoreViewStore extends MobxStore<[string]> {
  store: Store
  purchases: Purchase[] = []

  async loadStore(id: string) {
    const store = await storesApi.findOne(id)
    const purchases = await purchasesApi.find(0, 1000, id)
    runInAction(() => {
      this.store = store
      this.purchases = purchases
    })
  }

  async initialize([id]: [string]) {
    if (id) this.loadStore(id)
    return
  }
}
