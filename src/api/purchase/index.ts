import Api from '..'
import { plainToInstance } from 'class-transformer'

import { Purchase } from './purchase'

export class PurchasesApi extends Api {
  async find(offset = 0, limit = 100, storeId?: string) {
    const req = await this.axios.get<Purchase[]>('/purchases', {
      params: { offset, limit, storeId },
    })
    return plainToInstance(Purchase, req.data)
  }

  async findOne(id: string) {
    const req = await this.axios.get<Purchase>(`/purchases/${id}`)
    return plainToInstance(Purchase, req.data)
  }

  async create(data: Partial<Purchase>) {
    const req = await this.axios.post<Purchase>('/purchases', data)
    return plainToInstance(Purchase, req.data)
  }

  async update(id: string, data: Partial<Purchase>) {
    const req = await this.axios.patch<Purchase>(`/purchases/${id}`, data)
    return plainToInstance(Purchase, req.data)
  }

  async delete(id: string) {
    await this.axios.delete(`/purchases/${id}`)
  }
}

const purchasesApi = new PurchasesApi()
export default purchasesApi
