import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import PurchaseForm from '../../components/PurchaseForm'
import { useMobx } from '../useMobx'
import { PurchaseUpdateStore } from './store'
import './styles.module.css'

const PurchaseUpdate = observer(() => {
  const { id } = useParams()
  const state = useMobx(new PurchaseUpdateStore(), [id ?? null])

  return (
    <PurchaseForm
      submit={() => state.updatePurchase()}
      data={state.purchaseData}
      title="Update purchase"
    />
  )
})

export default PurchaseUpdate
