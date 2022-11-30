import { observer } from 'mobx-react-lite'

import { useMobx } from '../../pages/useMobx'
import { SelectVariant } from '../../utils/form'
import Select from '../Select'
import {
  ResourceSelectCreateFunc,
  ResourceSelectDeleteFunc,
  ResourceSelectEditFunc,
  ResourceSelectFindFunc,
  ResourceSelectStore,
} from './store'
import './styles.module.css'

interface Props {
  label?: string
  selected: string[] | SelectVariant[]
  onChange: (variants: SelectVariant[]) => any
  create?: ResourceSelectCreateFunc
  find: ResourceSelectFindFunc
  edit?: ResourceSelectEditFunc
  delete?: ResourceSelectDeleteFunc
  secondary?: boolean
  single?: boolean
  disabled?: boolean
  onBlur?: () => void
  error?: string
}

const ResourceSelect = observer(
  ({
    label,
    selected,
    onChange: _onChange,
    create,
    find,
    secondary,
    delete: onDelete,
    single,
    disabled,
    onBlur,
    edit,
    error,
  }: Props) => {
    const state = useMobx(new ResourceSelectStore(), [
      find,
      create,
      edit,
      onDelete,
    ])

    const onChange = (ids: string[]) => {
      _onChange(
        ids.map(
          (id) => state.variants.find((v) => v.code === id) as SelectVariant,
        ),
      )
    }

    let selectedIds: string[] = []
    if (selected.length) {
      if (typeof selected[0] === 'string') selectedIds = selected as string[]
      else selectedIds = (selected as SelectVariant[]).map((s) => s.code)
    }

    const _create = async (name: string) => {
      const item = await state.create(name)
      onChange([...selectedIds, item.id])
    }

    const _edit = async (code: string) => {
      const name = prompt(
        'Новое название',
        state.items.find((i) => i.id === code)?.name,
      )
      if (!name) return
      state.edit(code, name)
    }

    return (
      <div styleName="wrapper">
        {single && (
          <Select
            secondary={secondary}
            placeholder={secondary ? label : 'Выберите'}
            label={secondary ? undefined : label}
            variants={state.variants}
            onChange={(ch: string) => {
              onChange([ch])
            }}
            create={_create}
            onEdit={edit ? _edit : undefined}
            onDelete={onDelete ? (code) => state.delete(code) : undefined}
            selected={selected[0] ?? undefined}
            single={true}
            disabled={disabled}
            onBlur={onBlur}
            error={error}
          />
        )}
        {!single && (
          <Select
            secondary={secondary}
            placeholder={secondary ? label : 'Выберите'}
            label={secondary ? undefined : label}
            variants={state.variants}
            onChange={(ch: SelectVariant[]) => {
              onChange(ch.map((c) => c.code))
            }}
            create={_create}
            onEdit={edit ? _edit : undefined}
            onDelete={onDelete ? (code) => state.delete(code) : undefined}
            selected={selected}
            single={false}
            disabled={disabled}
            onBlur={onBlur}
            error={error}
          />
        )}
      </div>
    )
  },
)

export default ResourceSelect
