import { runInAction } from 'mobx'

import storesApi from '../../api/store'
import { Store } from '../../api/store/store'
import { MobxStore, observableStore } from '../useMobx'

@observableStore
export class StoresListStore extends MobxStore {
  stores: Store[] = []

  async loadStores() {
    const stores = await storesApi.find()
    runInAction(() => {
      this.stores = stores
    })
  }

  async initialize() {
    await this.loadStores()
    return
  }
}
