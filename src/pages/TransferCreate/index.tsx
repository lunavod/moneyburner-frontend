import { observer } from 'mobx-react-lite'

import TransferForm from '../../components/TransferForm'
import { useMobx } from '../useMobx'
import { TransferCreateStore } from './store'
import './styles.module.css'

const TransferCreate = observer(() => {
  const state = useMobx(new TransferCreateStore())

  return (
    <TransferForm
      data={state.data}
      submit={() => state.createTransfer()}
      type={state.type}
      setType={(t) => state.setType(t)}
    />
  )
})

export default TransferCreate
