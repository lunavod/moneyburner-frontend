import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { forwardRef } from 'react'

import styles from './styles.module.css'

interface Props {
  label?: string
  placeholder?: string
  children?: React.ReactNode
  focused?: boolean
  empty?: boolean
  className?: string
  secondary?: boolean
  error?: string
  onClick?: () => void
  disabled?: boolean
}

let InputBase = forwardRef<HTMLDivElement, Props>(
  (
    {
      label,
      placeholder,
      focused,
      empty,
      children,
      className,
      secondary,
      error,
      disabled,
      onClick,
    }: Props,
    ref,
  ) => {
    return (
      <div styleName="wrapperWrapper">
        <div className={styles.wrapper}>
          <div
            className={clsx(
              styles.container,
              className,
              focused && styles.focused,
              empty && styles.empty,
              secondary && styles.secondary,
              disabled && styles.disabled,
            )}
            ref={ref}
            onClick={onClick}
          >
            {!!label && (
              <span className={styles.label}>
                <span className={styles.labelText}>{label}</span>
              </span>
            )}

            {!!placeholder && (
              <span className={styles.placeholder}>{placeholder}</span>
            )}

            {children}
          </div>
        </div>
        {error && <span className="clr-red-600 text-subtitles">{error}</span>}
      </div>
    )
  },
)
InputBase.displayName = 'InputBase'
InputBase = observer(InputBase)

export default InputBase
