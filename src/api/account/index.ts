import Api from '..'
import { plainToInstance } from 'class-transformer'

import { Account } from './account'

export class AccountsApi extends Api {
  async find(offset = 0, limit = 100) {
    const req = await this.axios.get<Account[]>('/accounts', {
      params: { offset, limit },
    })
    return plainToInstance(Account, req.data)
  }

  async findOne(id: string) {
    const req = await this.axios.get<Account>(`/accounts/${id}`)
    return plainToInstance(Account, req.data)
  }

  async create(data: Partial<Account>) {
    const req = await this.axios.post<Account>('/accounts', data)
    return plainToInstance(Account, req.data)
  }

  async update(id: string, data: Partial<Account>) {
    const req = await this.axios.patch<Account>(`/accounts/${id}`, data)
    return plainToInstance(Account, req.data)
  }
}

const accountsApi = new AccountsApi()
export default accountsApi
