import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

import PlusIcon from '../../assets/icons/myicons/plus.svg'
import './styles.module.css'

interface Props {
  className?: string
  children: React.ReactNode
}

const Navbar = {
  Main: observer(
    forwardRef<HTMLDivElement, Props>(({ className, children }: Props, ref) => {
      return (
        <div styleName="wrapper" className={className} ref={ref}>
          {children}
        </div>
      )
    }),
  ),
  Button: observer(
    ({
      icon,
      to,
      onClick,
      fab,
    }: {
      icon: any
      to?: string
      onClick?: () => void
      fab?: boolean
    }) => {
      const Icon = icon
      if (!!to)
        return (
          <Link to={to} styleName={fab ? 'fab' : 'btn'}>
            <Icon />
          </Link>
        )
      return (
        <div onClick={onClick} styleName={fab ? 'fab' : 'btn'}>
          <Icon />
        </div>
      )
    },
  ),

  Location: observer(
    ({
      icon,
      to,
      name,
      locations,
    }: {
      icon: any
      to: string
      name: string
      locations: string[]
    }) => {
      const Icon = icon
      const active = locations.some((l) =>
        l === '/' ? location.pathname === '/' : location.pathname.startsWith(l),
      )
      return (
        <Link to={to} styleName="location">
          <div styleName={clsx('iconWrapper', active && 'active')}>
            <Icon />
          </div>
          <span styleName="name">{name}</span>
        </Link>
      )
    },
  ),
}

export default Navbar
