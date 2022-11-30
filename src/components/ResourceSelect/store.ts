import { sortBy } from 'lodash-es'
import { runInAction } from 'mobx'

import { MobxStore, observableStore } from '../../pages/useMobx'

export type ResourceSelectFindFunc = () => Promise<ResourceSelectItem[]>
export type ResourceSelectCreateFunc = (data: {
  name: string
}) => Promise<ResourceSelectItem>
export type ResourceSelectEditFunc = (
  code: string,
  data: {
    name: string
  },
) => Promise<ResourceSelectItem>
export type ResourceSelectDeleteFunc = (code: string) => Promise<any>

export interface ResourceSelectItem {
  id: string
  name: string
}

type InitProps = [
  ResourceSelectFindFunc,
  ResourceSelectCreateFunc,
  ResourceSelectEditFunc,
  ResourceSelectDeleteFunc,
]

@observableStore
export class ResourceSelectStore extends MobxStore<InitProps> {
  items: ResourceSelectItem[] = []

  _find: ResourceSelectFindFunc
  _create: ResourceSelectCreateFunc
  _edit: ResourceSelectEditFunc
  _delete: ResourceSelectDeleteFunc

  async initialize([find, create, edit, _delete]: InitProps) {
    this._find = find
    this._create = create
    this._edit = edit
    this._delete = _delete

    await this.load()
    return
  }

  get variants() {
    return this.items.map((i) => ({ code: i.id, name: i.name }))
  }

  async load() {
    const items = sortBy(await this._find(), 'id')

    runInAction(() => {
      this.items = items
    })
  }

  async create(name: string) {
    const item = await this._create({ name })
    await this.load()
    return item
  }

  async edit(code: string, name: string) {
    const item = await this._edit(code, { name })
    await this.load()
    return item
  }

  async delete(code: string) {
    const item = await this._delete(code)
    await this.load()
    return item
  }
}
