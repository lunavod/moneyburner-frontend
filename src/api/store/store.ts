import { Type } from 'class-transformer'

export class Store {
  id: string

  name: string
  alias?: string | null

  @Type(() => Date)
  createdAt: Date
}
