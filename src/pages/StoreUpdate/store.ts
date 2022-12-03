import { runInAction } from 'mobx'

import storesApi from '../../api/store'
import { Store } from '../../api/store/store'
import FormState from '../../utils/form'
import { MobxStore, observableStore } from '../useMobx'

export type StoreForm = {
  name: string
  alias: string
}

@observableStore
export class StoreUpdateStore extends MobxStore<[string]> {
  store: Store

  data = new FormState<StoreForm>({
    name: '',
    alias: '',
  })

  async loadStore(id: string) {
    const store = await storesApi.findOne(id)
    runInAction(() => {
      this.store = store
      this.data.reset({
        name: store.name,
        alias: store.alias ?? '',
      })
    })
  }

  async initialize([id]: [string]) {
    if (id) this.loadStore(id)
    return
  }

  async saveOrder() {
    const data: Partial<Store> = { ...this.data.form }
    if (data.alias === '') data.alias = null

    await storesApi.update(this.store.id, data)
    await this.initialize([this.store.id])
  }
}
