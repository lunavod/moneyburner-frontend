import Api from '..'
import { plainToInstance } from 'class-transformer'

import { Currency } from './currency'

export class CurrenciesApi extends Api {
  async find(offset = 0, limit = 100) {
    const req = await this.axios.get<Currency[]>('/currencies', {
      params: { offset, limit },
    })
    return plainToInstance(Currency, req.data)
  }

  async findOne(id: string) {
    const req = await this.axios.get<Currency>(`/currencies/${id}`)
    return plainToInstance(Currency, req.data)
  }

  async create(data: Partial<Currency>) {
    const req = await this.axios.post<Currency>('/currencies', data)
    return plainToInstance(Currency, req.data)
  }

  async update(id: string, data: Partial<Currency>) {
    const req = await this.axios.patch<Currency>(`/currencies/${id}`, data)
    return plainToInstance(Currency, req.data)
  }
}

const currenciesApi = new CurrencysApi()
export default currenciesApi
