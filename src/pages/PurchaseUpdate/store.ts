import { DateTime } from 'luxon'
import { runInAction, toJS } from 'mobx'

import accountsApi from '../../api/account'
import { Account } from '../../api/account/account'
import purchasesApi from '../../api/purchase'
import { Purchase } from '../../api/purchase/purchase'
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
export class PurchaseUpdateStore extends MobxStore<Props> {
  purchaseData = new FormState<PurchaseFormData>({
    accountId: '',
    shopId: '',
    value: '0',
    dateTime: DateTime.now().toISO(),
    _date: DateTime.now().toFormat('dd.MM.yyyy'),
    _time: DateTime.now().toFormat('HH:mm'),
  })

  purchase: Purchase

  async loadPurchase(id: string) {
    const purchase = await purchasesApi.findOne(id)
    runInAction(() => {
      this.purchase = purchase
      this.purchaseData.set('accountId', purchase.accountId)
      this.purchaseData.set('shopId', purchase.storeId)
      this.purchaseData.set('value', purchase.value.toString())
      this.purchaseData.set(
        'dateTime',
        DateTime.fromJSDate(purchase.date).toISO(),
      )
      this.purchaseData.set(
        '_date',
        DateTime.fromJSDate(purchase.date).toFormat('dd.MM.yyyy'),
      )
      this.purchaseData.set(
        '_time',
        DateTime.fromJSDate(purchase.date).toFormat('HH:mm'),
      )
    })
    console.log(toJS(this.purchaseData.form))
  }

  async initialize([id]: Props) {
    if (id) {
      this.loadPurchase(id)
    }
    return
  }

  async updatePurchase() {
    if (!this.purchase) return

    const { accountId, shopId, value, dateTime } = this.purchaseData.form
    const purchase = {
      accountId,
      storeId: shopId,
      value: Number(value),
      date: DateTime.fromISO(dateTime).toJSDate(),
    }
    await purchasesApi.update(this.purchase.id, purchase)
    location.href = '/'
    console.log(purchase)
    return
  }
}
