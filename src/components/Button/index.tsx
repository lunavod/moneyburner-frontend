/* eslint-disable react/prop-types */

/* eslint-disable react/display-name */
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { forwardRef, useRef } from 'react'
import { useLinkClickHandler } from 'react-router-dom'

import styles from './styles.module.css'

const Button = observer(
  forwardRef<HTMLAnchorElement, Props>(
    (
      {
        id,
        text,
        icon,
        children,
        to,
        onClick: callback,
        className,
        primary,
        secondary,
        disabled,
        color,
        resting,
        nobackground,
        nobackgroundBordered,
        big,
      }: Props,
      ref,
    ) => {
      const iconOnly = !text && !!icon
      const Icon = icon

      const linkOnClickHandler = to && useLinkClickHandler(to)
      const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        if (disabled) return
        if (callback) callback(e)
        // @ts-ignore
        if (to) linkOnClickHandler(e)
      }

      return (
        <a
          ref={ref}
          id={id}
          className={clsx(
            styles.wrapper,
            iconOnly && styles.iconOnly,
            className,
            primary && styles.primary,
            secondary && styles.secondary,
            disabled && styles.disabled,
            resting && styles.resting,
            nobackground && styles.nobackground,
            nobackgroundBordered && styles.nobackgroundBordered,
            big && styles.big,
          )}
          href={to as string}
          style={{ color }}
          onClick={onClick}
        >
          <>
            {!!icon && <Icon />}
            {!!text && text}
            {!!children && children}
          </>
        </a>
      )
    },
  ),
)

export default Button

interface BaseProps {
  className?: string
  primary?: boolean
  secondary?: boolean
  disabled?: boolean
  resting?: boolean
  nobackground?: boolean
  nobackgroundBordered?: boolean
  color?: string
  big?: boolean
  id?: string
}

interface WithIcon {
  icon: any
  text?: string
  children?: React.ReactNode
}

interface WithText {
  children?: React.ReactNode
  text: string
  icon?: any
}

interface WithReactNode {
  children: React.ReactNode
  text?: string
  icon?: any
}

interface WithCallback {
  onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => any
  to?: never
}

interface WithLink {
  onClick?: () => any
  to: string
}

type Props = BaseProps &
  (WithCallback | WithLink) &
  (WithReactNode | WithIcon | WithText)
