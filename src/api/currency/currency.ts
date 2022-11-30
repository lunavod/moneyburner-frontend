import { Type } from 'class-transformer'

export class Currency {
  id: string

  name: string
  code: string
  symbol?: string

  @Type(() => Date)
  createdAt: Date
}
