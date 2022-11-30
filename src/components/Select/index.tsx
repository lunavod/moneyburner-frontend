import clsx from 'clsx'
import { uniq } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useState, useRef, useEffect } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'

import CloseIcon from '../../assets/icons/myicons/close.svg'
import EditIcon from '../../assets/icons/myicons/edit.svg'
import DeleteIcon from '../../assets/icons/myicons/trash.svg'
import { SelectVariant } from '../../utils/form'
import InputBase from '../InputBase'
import styles from './styles.module.css'

interface BaseProps {
  label?: string
  placeholder?: string
  variants: SelectVariant[]
  required?: boolean
  secondary?: boolean
  create?: (name: string) => any
  noSearch?: boolean
  transformSelected?: (val: string) => string
  onDelete?: (code: string) => any
  onEdit?: (code: string) => any
  disabled?: boolean
  onBlur?: () => void
  error?: string
}

interface Single {
  single: true
  selected?: string | SelectVariant
  onChange: (value: string) => any
  select?: never
  unselect?: never
}

interface Multiple {
  single?: false
  selected: string[] | SelectVariant[]
  onChange: (value: SelectVariant[]) => any
}

type Props = BaseProps & (Single | Multiple)

const Select = observer((props: Props) => {
  const { label, placeholder, single, selected, variants, secondary } = props

  const [focused, _setFocused] = useState(false)

  const setFocused = (val: boolean) => {
    _setFocused(val)
    if (!val && props.onBlur) props.onBlur()
  }

  const singleSelectedCode =
    single && selected
      ? typeof selected === 'string'
        ? selected
        : selected.code
      : null

  const singleSelectedName =
    single && selected
      ? variants.find((v) => v.code === singleSelectedCode)?.name
      : null

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (single)
      setSearch(variants.find((v) => v.code === singleSelectedCode)?.name || '')
  }, [singleSelectedCode, variants.length])

  const ref = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      e.preventDefault()
      inputRef.current?.focus()
    }

    const onDocumentClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as HTMLElement)) setFocused(false)
    }

    ref.current?.addEventListener('click', onClick)

    document.addEventListener('click', onDocumentClick)

    return () => {
      ref.current?.removeEventListener('click', onClick)
      document.removeEventListener('click', onDocumentClick)
    }
  }, [ref.current, inputRef.current])

  const rewrittenOnChange = (value: string | SelectVariant[]) => {
    if (single) setFocused(false)
    props.onChange(value as string & SelectVariant[])
  }

  let selectedVariants: SelectVariant[] = []
  if (single) {
    selectedVariants = []
  } else if (selected.length) {
    const isString = typeof selected[0] === 'string'
    if (isString) {
      selectedVariants = variants.filter((v) =>
        (selected as string[]).includes(v.code),
      )
    } else {
      selectedVariants = selected as SelectVariant[]
    }
  }

  const unselect = (variant: SelectVariant) => {
    if (single) return
    if (!props.selected || !Array.isArray(props.selected)) return
    const codes = props.selected.map((v) =>
      typeof v === 'string' ? v : v.code,
    )
    const index = codes.indexOf(variant.code)
    if (index !== -1) codes.splice(index, 1)
    props.onChange(
      codes.map((c) => variants.find((v) => v.code === c)) as SelectVariant[],
    )
  }

  return (
    <div
      styleName="wrapper"
      style={{ pointerEvents: props.disabled ? 'none' : 'all' }}
    >
      <InputBase
        label={label}
        ref={ref}
        focused={focused}
        secondary={secondary}
        onClick={() => setFocused(true)}
        error={
          single && !focused && search && search !== singleSelectedName
            ? 'Not selected'
            : props.error ?? undefined
        }
        disabled={!!props.disabled}
      >
        {!props.noSearch && (
          <input
            autoComplete="off"
            onFocus={() => setFocused(true)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={inputRef}
            spellCheck={false}
            placeholder={placeholder}
          />
        )}
        {props.noSearch && (
          <span
            styleName="searchSpan"
            onClick={() => setFocused(true)}
            ref={inputRef}
          >
            {props.transformSelected ? props.transformSelected(search) : search}
          </span>
        )}
        {focused && (
          <List
            {...{ ...props, onChange: rewrittenOnChange }}
            singleSelectedCode={singleSelectedCode}
            singleSelectedName={singleSelectedName ?? null}
            search={search}
          />
        )}
      </InputBase>
      {!single && !!selectedVariants.length && (
        <div styleName="selectedVariantsList">
          {selectedVariants.map((v) => (
            <div
              styleName="selectedVariant"
              key={v.code}
              onClick={() => unselect(v)}
            >
              {v.name}
              <CloseIcon />
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

export default Select

const List = observer(
  ({
    variants,
    onChange,
    single,
    singleSelectedCode,
    singleSelectedName,
    selected,
    required,
    create,
    search,
    onDelete,
    onEdit,
    noSearch,
  }: Props & {
    singleSelectedCode: string | null
    search: string
    singleSelectedName: string | null
  }) => {
    const select = (variant: SelectVariant) => {
      if (single) {
        onChange(variant.code)
      } else {
        const slctd: SelectVariant[] = []
        selected.forEach((v) => {
          if (typeof v === 'string') {
            slctd.push(variants.find((vv) => vv.code === v) as SelectVariant)
          } else {
            slctd.push(v)
          }
        })
        onChange(uniq([...slctd, variant]))
      }
    }

    const unselect = (variant: SelectVariant) => {
      if (single) {
        if (required) return
        if (singleSelectedCode === variant.code) onChange('')
      } else {
        const codes = selected.map((v) => (typeof v === 'string' ? v : v.code))
        const index = codes.indexOf(variant.code)
        if (index !== -1) codes.splice(index, 1)
        onChange(
          codes.map((c) =>
            variants.find((v) => v.code === c),
          ) as SelectVariant[],
        )
      }
    }

    const onDeleteClick = (e: React.MouseEvent, code: string) => {
      e.stopPropagation()
      if (onDelete) onDelete(code)
    }

    const onEditClick = (e: React.MouseEvent, code: string) => {
      e.stopPropagation()
      if (onEdit) onEdit(code)
    }

    useEffect(() => {
      const el = document.getElementsByClassName(styles.selected)[0]
      if (!el) return
      scrollIntoView(el, { scrollMode: 'if-needed' })
    }, [])

    return (
      <div className={styles.list} onClick={(e) => e.stopPropagation()}>
        {variants
          .filter(
            (v) =>
              (search && singleSelectedName === search) ||
              noSearch ||
              v.name.toLowerCase().startsWith(search.toLowerCase()),
          )
          .map((variant) => {
            let isSelected = false
            if (single) {
              isSelected = singleSelectedCode === variant.code
            } else {
              const codes = selected.map((v) =>
                typeof v === 'string' ? v : v.code,
              )
              isSelected = !!codes.find((v) => v === variant.code)
            }
            return (
              <div
                key={variant.code}
                className={clsx(styles.variant, isSelected && styles.selected)}
                onClick={(e) => {
                  isSelected ? unselect(variant) : select(variant)
                }}
              >
                {variant.name}
                <div styleName="actions">
                  {!!onEdit && (
                    <span onClick={(e) => onEditClick(e, variant.code)}>
                      <EditIcon />
                    </span>
                  )}
                  {!!onDelete && (
                    <span onClick={(e) => onDeleteClick(e, variant.code)}>
                      <DeleteIcon />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        {!!create &&
          !!search &&
          !variants.find(
            (v) => v.name.toLowerCase() === search.toLowerCase(),
          ) && (
            <div className={styles.variant} onClick={() => create(search)}>
              <i>
                Создать <b>{search}</b>
              </i>
            </div>
          )}
      </div>
    )
  },
)
