import Api from '..'
import { plainToInstance } from 'class-transformer'

import { Store } from './store'

export class StoresApi extends Api {
  async find(offset = 0, limit = 100) {
    const req = await this.axios.get<Store[]>('/stores', {
      params: { offset, limit },
    })
    return plainToInstance(Store, req.data)
  }

  async findOne(id: string) {
    const req = await this.axios.get<Store>(`/stores/${id}`)
    return plainToInstance(Store, req.data)
  }

  async create(data: Partial<Store>) {
    const req = await this.axios.post<Store>('/stores', data)
    return plainToInstance(Store, req.data)
  }

  async update(id: string, data: Partial<Store>) {
    const req = await this.axios.patch<Store>(`/stores/${id}`, data)
    return plainToInstance(Store, req.data)
  }
}

const storesApi = new StoresApi()
export default storesApi
