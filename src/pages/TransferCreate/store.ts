import { DateTime } from 'luxon'

import moneyTransfersApi from '../../api/moneyTransfer'
import { MoneyTransfer } from '../../api/moneyTransfer/moneyTransfer'
import FormState from '../../utils/form'
import { MobxStore, observableStore } from '../useMobx'

export type TransferFormData = {
  sourceAccountId: string
  targetAccountId: string

  increment: string
  decrement: string

  name: string

  dateTime: string
  _date: string
  _time: string
}

@observableStore
export class TransferCreateStore extends MobxStore {
  type: TransferType = 'internal'

  data: FormState<TransferFormData> = new FormState<TransferFormData>({
    sourceAccountId: '',
    targetAccountId: '',
    increment: '0',
    decrement: '0',
    name: '',
    dateTime: DateTime.now().toISO(),
    _date: DateTime.now().toFormat('dd.MM.yyyy'),
    _time: DateTime.now().toFormat('HH:mm'),
  })

  setType(type: TransferType) {
    this.type = type
    this.data.reset()
  }

  async createTransfer() {
    const data: Partial<MoneyTransfer> = {}

    data.date = DateTime.fromISO(this.data.form.dateTime).toJSDate()
    if (this.type === 'internal' || this.type === 'income') {
      data.targetAccountId = this.data.form.targetAccountId
      data.increment = parseFloat(this.data.form.increment)
    }
    if (this.type === 'internal' || this.type === 'payment') {
      data.sourceAccountId = this.data.form.sourceAccountId
      data.decrement = parseFloat(this.data.form.decrement)
    }
    if (this.type === 'payment') {
      data.name = this.data.form.name
    }

    if (this.type === 'internal') {
      if (!data.targetAccountId || !data.increment) {
        return
      }
      if (!data.sourceAccountId || !data.decrement) {
        return
      }
    }

    if (this.type === 'income') {
      if (!data.targetAccountId || !data.increment) {
        return
      }
    }

    if (this.type === 'payment') {
      if (!data.sourceAccountId || !data.decrement || !data.name) {
        return
      }
    }

    await moneyTransfersApi.create(data)
    location.href = new URLSearchParams(location.search).get('back') || '/'
  }

  async initialize() {
    return
  }
}

export type TransferType = 'internal' | 'income' | 'payment'
