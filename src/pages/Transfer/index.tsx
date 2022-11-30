import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import moneyTransfersApi from '../../api/moneyTransfer'
import purchasesApi from '../../api/purchase'
import BackIcon from '../../assets/icons/myicons/back.svg'
import EditIcon from '../../assets/icons/myicons/edit.svg'
import TrashIcon from '../../assets/icons/myicons/trash.svg'
import { useMobx } from '../useMobx'
import { TransferStore } from './store'
import './styles.module.css'

const Purchase = observer(() => {
  const { id } = useParams()
  const state = useMobx(new TransferStore(), [id])

  if (!state.transfer) return <></>

  const onDeleteClick = async () => {
    if (!confirm('Are you sure you want to delete this transfer?')) return

    await moneyTransfersApi.delete(state.transfer.id)
    location.href = `/`
  }

  return (
    <div styleName="wrapper">
      <div styleName="top">
        <Link to="/" styleName="btn">
          <BackIcon />
        </Link>

        <div styleName="btn right" onClick={onDeleteClick}>
          <TrashIcon />
        </div>
        <Link
          to={`/transfers/${state.transfer.id}/edit?back=${location.pathname}`}
          styleName="btn"
        >
          <EditIcon />
        </Link>
      </div>
      <div styleName="title">
        <h1>Transfer</h1>
      </div>
      <div styleName="transfer">
        {!!state.transfer.sourceAccount && (
          <div styleName="element">
            <div styleName="name">{state.transfer.sourceAccount?.name}</div>
            <div styleName="value">
              -{state.transfer.decrement}
              {state.transfer.sourceAccount?.currency?.symbol ??
                state.transfer.sourceAccount?.currency?.code}
            </div>
            <div styleName="date">
              {DateTime.fromJSDate(state.transfer.date).toLocaleString({
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </div>
          </div>
        )}
        {!!state.transfer.targetAccount && (
          <div styleName="element">
            <div styleName="name">{state.transfer.targetAccount?.name}</div>
            <div styleName="value">
              +{state.transfer.increment}
              {state.transfer.targetAccount?.currency?.symbol ??
                state.transfer.targetAccount?.currency?.code}
            </div>
            <div styleName="date">
              {DateTime.fromJSDate(state.transfer.date).toLocaleString({
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default Purchase
