import clsx from 'clsx'
import { Settings } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Routes, Route, useLocation } from 'react-router-dom'
import { BreakpointProvider, useCurrentBreakpointName } from 'react-socks'

import AccountView from '../../pages/AccountView'
import AccountsList from '../../pages/AccountsList'
import Purchase from '../../pages/Purchase'
import PurchaseCreate from '../../pages/PurchaseCreate'
import PurchaseUpdate from '../../pages/PurchaseUpdate'
import Transfer from '../../pages/Transfer'
import TransferCreate from '../../pages/TransferCreate'
import TransferUpdate from '../../pages/TransferUpdate'
import { useMobx } from '../../pages/useMobx'
import ScrollToTop from '../scrollToTop'
import { GlobalState, GlobalStateContext, useGlobalState } from './globalState'
import styles from './styles.module.css'

Settings.defaultLocale = 'ru'

export const Content = ({
  children,
  noMaxWidth,
  className,
}: {
  children: React.ReactNode
  noMaxWidth?: boolean
  className?: string
}) => {
  const breakpoint = useCurrentBreakpointName()
  const mobile = ['xsmall', 'small', 'medium'].includes(breakpoint)
  return (
    <div
      className={clsx(
        styles.content,
        noMaxWidth && styles.noMaxWidth,
        mobile && styles.mobile,
        className && className,
      )}
    >
      {children}
    </div>
  )
}

const LocationTracker = () => {
  const { pathname } = useLocation()
  const [firstTime, setFirstTime] = useState(true)

  const breakpoint = useCurrentBreakpointName()
  const mobile =
    globalThis.IS_MOBILE ?? ['xsmall', 'small', 'medium'].includes(breakpoint)

  const globalState = useGlobalState()

  useEffect(() => {
    globalState.setIsMobile(mobile)
  }, [breakpoint])
  return <></>
}

const App = observer(() => {
  const state = useMobx(new GlobalState(), undefined, 'globalState')
  const mobile = state.isMobile

  const { pathname } = useLocation()

  return (
    <GlobalStateContext.Provider value={state}>
      <Helmet>
        <title>TrendyManga</title>
        <meta name="description" content="Читать мангу онлайн" />
        <link rel="canonical" href={location.origin + pathname} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      </Helmet>
      <BreakpointProvider>
        <LocationTracker />
        <div className={clsx(styles.app, mobile && styles.mobile)}>
          <ScrollToTop>
            <Routes>
              <Route index element={<AccountsList />} />
              <Route path="/accounts/:id" element={<AccountView />} />

              <Route path="/purchases/new" element={<PurchaseCreate />} />
              <Route path="/purchases/:id" element={<Purchase />} />
              <Route path="/purchases/:id/edit" element={<PurchaseUpdate />} />

              <Route path="/transfers/new" element={<TransferCreate />} />
              <Route path="/transfers/:id" element={<Transfer />} />
              <Route path="/transfers/:id/edit" element={<TransferUpdate />} />
            </Routes>
          </ScrollToTop>
        </div>
      </BreakpointProvider>
    </GlobalStateContext.Provider>
  )
})

export default App
