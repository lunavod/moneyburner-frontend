import { Type } from 'class-transformer'

export class Store {
  id: string

  name: string
  alias?: string

  @Type(() => Date)
  createdAt: Date
}
