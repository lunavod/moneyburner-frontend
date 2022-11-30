import { observer } from 'mobx-react-lite'
import { useState, useRef, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import InputBase from '../InputBase'
import styles from './styles.module.css'

interface Props {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

const Textarea = observer(({ label, placeholder, value, onChange }: Props) => {
  const [focused, setFocused] = useState(false)

  const ref = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      e.preventDefault()
      inputRef.current?.focus()
    }

    ref.current?.addEventListener('click', onClick)

    return () => ref.current?.removeEventListener('click', onClick)
  }, [ref.current, inputRef.current])

  return (
    <InputBase
      label={label}
      placeholder={value || focused ? undefined : placeholder}
      ref={ref}
    >
      <TextareaAutosize
        className={styles.textarea}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={inputRef}
      />
    </InputBase>
  )
})

export default Textarea
