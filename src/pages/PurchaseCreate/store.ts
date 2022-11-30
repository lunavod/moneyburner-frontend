import { DateTime } from 'luxon'
import { runInAction } from 'mobx'

import accountsApi from '../../api/account'
import { Account } from '../../api/account/account'
import purchasesApi from '../../api/purchase'
import storesApi from '../../api/store'
import { Store } from '../../api/store/store'
import FormState from '../../utils/form'
import { MobxStore, observableStore } from '../useMobx'

type Props = [string | null]

export type PurchaseFormData = {
  accountId: string
  shopId: string
  value: string
  dateTime: string
  _date: string
  _time: string
}

@observableStore
export class PurchaseViewStore extends MobxStore<Props> {
  purchaseData = new FormState<PurchaseFormData>({
    accountId: '',
    shopId: '',
    value: '0',
    dateTime: DateTime.now().toISO(),
    _date: DateTime.now().toFormat('dd.MM.yyyy'),
    _time: DateTime.now().toFormat('HH:mm'),
  })

  async initialize([accountId]: Props) {
    if (accountId) this.purchaseData.set('accountId', accountId)
    return
  }

  async createPurchase() {
    const { accountId, shopId, value, dateTime } = this.purchaseData.form
    const purchase = {
      accountId,
      storeId: shopId,
      value: Number(value),
      date: DateTime.fromISO(dateTime).toJSDate(),
    }
    await purchasesApi.create(purchase)
    location.href = '/'
    console.log(purchase)
    return
  }
}
