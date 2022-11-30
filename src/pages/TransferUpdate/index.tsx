import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import TransferForm from '../../components/TransferForm'
import { useMobx } from '../useMobx'
import { TransferCreateStore } from './store'
import './styles.module.css'

const TransferCreate = observer(() => {
  const { id } = useParams<{ id: string }>()
  const state = useMobx(new TransferCreateStore(), [id])

  return (
    <TransferForm
      data={state.data}
      submit={() => state.updateTransfer()}
      type={state.type}
      setType={(t) => state.setType(t)}
    />
  )
})

export default TransferCreate
