import clsx from 'clsx'
import { noop } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { createContext, useContext } from 'react'

import './styles.module.css'

type Context = {
  activeId: string | null
  select: (id: string) => any
}

type Props = Context & {
  children: React.ReactNode
  small?: boolean
}

const TabsContext = createContext<Context>({ activeId: null, select: noop })

const Wrapper = observer(({ activeId, select, children, small }: Props) => {
  return (
    <TabsContext.Provider value={{ activeId, select }}>
      <div styleName={clsx('wrapper', small && 'small')}>{children}</div>
    </TabsContext.Provider>
  )
})

const Tab = observer(
  ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { activeId, select } = useContext(TabsContext)

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()
      select(id)
    }
    return (
      <div
        styleName={clsx('tab', activeId === id && 'active')}
        onClick={onClick}
      >
        {children}
      </div>
    )
  },
)

const Tabs = {
  Wrapper,
  Tab,
}

export default Tabs
