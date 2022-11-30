import Api from '..'
import { plainToInstance } from 'class-transformer'

import { MoneyTransfer } from './moneyTransfer'

export class MoneyTransfersApi extends Api {
  async find(offset = 0, limit = 100) {
    const req = await this.axios.get<MoneyTransfer[]>('/money-transfers', {
      params: { offset, limit },
    })
    return plainToInstance(MoneyTransfer, req.data)
  }

  async findOne(id: string) {
    const req = await this.axios.get<MoneyTransfer>(`/money-transfers/${id}`)
    return plainToInstance(MoneyTransfer, req.data)
  }

  async create(data: Partial<MoneyTransfer>) {
    const req = await this.axios.post<MoneyTransfer>('/money-transfers', data)
    return plainToInstance(MoneyTransfer, req.data)
  }

  async update(id: string, data: Partial<MoneyTransfer>) {
    const req = await this.axios.patch<MoneyTransfer>(
      `/money-transfers/${id}`,
      data,
    )
    return plainToInstance(MoneyTransfer, req.data)
  }

  async delete(id: string) {
    await this.axios.delete(`/money-transfers/${id}`)
  }
}

const moneyTransfersApi = new MoneyTransfersApi()
export default moneyTransfersApi
