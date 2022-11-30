import { noop } from 'lodash-es'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'

import accountsApi from '../../api/account'
import storesApi from '../../api/store'
import Button from '../../components/Button'
import Navbar from '../../components/Navbar'
import PurchaseForm from '../../components/PurchaseForm'
import ResourceSelect from '../../components/ResourceSelect'
import TextInput from '../../components/TextInput'
import { useMobx } from '../useMobx'
import { PurchaseViewStore } from './store'
import './styles.module.css'

const PurchaseCreate = observer(() => {
  const accountId = new URLSearchParams(location.search).get('accountId')
  const state = useMobx(new PurchaseViewStore(), [accountId])

  return (
    <PurchaseForm
      accountId={accountId ?? undefined}
      submit={() => state.createPurchase()}
      data={state.purchaseData}
      title="New purchase"
    />
  )
})

export default PurchaseCreate
