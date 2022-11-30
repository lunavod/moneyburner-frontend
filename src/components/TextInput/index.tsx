import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'

import InputBase from '../InputBase'
import styles from './styles.module.css'

interface Props {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  onBlur?: () => void
  className?: string
  secondary?: boolean
  primary?: boolean
  children?: React.ReactNode
  type?: 'text' | 'password' | 'email' | 'number'
  error?: string
  inputRef?: React.MutableRefObject<HTMLInputElement | null>
  name?: string
  disabled?: boolean
}

const TextInput = observer(
  ({
    label,
    placeholder,
    value,
    onChange,
    onSubmit,
    className,
    primary,
    secondary,
    children,
    type,
    error,
    inputRef: inputRefProp,
    name,
    disabled,
    onBlur,
  }: Props) => {
    const [focused, setFocused] = useState(false)

    const ref = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const setInputRef = (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (inputRefProp) {
        inputRefProp.current = node
      }
    }

    useEffect(() => {
      const onClick = (e: MouseEvent) => {
        e.preventDefault()
        inputRef.current?.focus()
      }

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Enter') return

        if (onSubmit) onSubmit()
      }

      ref.current?.addEventListener('click', onClick)
      ref.current?.addEventListener('keydown', onKeyDown)

      return () => {
        ref.current?.removeEventListener('click', onClick)
        ref.current?.removeEventListener('keydown', onKeyDown)
      }
    }, [ref.current, inputRef.current])

    return (
      <InputBase
        secondary={secondary}
        label={label}
        placeholder={value || focused ? undefined : placeholder}
        ref={ref}
        className={clsx(className, primary && styles.primary)}
        error={error}
        focused={focused}
        empty={!value}
        disabled={!!disabled}
      >
        <input
          name={name}
          type={type ?? 'text'}
          style={{ width: '100%' }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            if (onBlur) onBlur()
            setFocused(false)
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={setInputRef}
          disabled={disabled}
        />
        {children}
      </InputBase>
    )
  },
)

export default TextInput
