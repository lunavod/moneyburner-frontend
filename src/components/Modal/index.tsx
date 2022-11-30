// TODO: Add hook and more functionality
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { v4 } from 'uuid'

import CloseSVG from '../../assets/icons/myicons/close.svg'
import styles from './styles.module.css'

interface ModalProps {
  title: string | React.ReactNode
  className?: string
  icon?: React.ReactNode
  children: any
  onUserClose?: () => void
}

class Modal {
  readonly id = v4()

  private container: HTMLDivElement = document.createElement('div')
  opened = false

  constructor(readonly props: ModalProps) {
    this.container.setAttribute(
      'style',
      'position: absolute; top: 0; width: 100%;',
    )
  }

  private get ModalComponent() {
    return observer(({ title, icon, children, className }: ModalProps) => {
      useEffect(() => {
        return () => {
          document.body.removeChild(this.container)
        }
      }, [])

      return (
        <div styleName="wrapper">
          <div className={clsx(styles.modal, className)}>
            <div styleName="header">
              {/* <span>{!!icon && icon}</span> */}
              <span>{title}</span>
              <span
                onClick={() => (
                  this.toggle(),
                  this.props.onUserClose && this.props.onUserClose()
                )}
                className="pointer"
              >
                <CloseSVG />
              </span>
            </div>
            <div styleName="content">{children}</div>
          </div>
        </div>
      )
    })
  }

  open() {
    if (this.opened)
      throw new Error(`Modal ${this.props.title} already opened!`)

    ReactDOM.render(
      <this.ModalComponent {...this.props} />,
      document.body.appendChild(this.container),
    )
    this.opened = true
  }

  close() {
    if (!this.opened)
      throw new Error(`Modal ${this.props.title} already closed!`)

    ReactDOM.unmountComponentAtNode(this.container)
    this.opened = false
  }

  toggle() {
    if (this.opened) this.close()
    else this.open()
  }
}

export default Modal
