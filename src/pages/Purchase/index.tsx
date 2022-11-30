import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import purchasesApi from '../../api/purchase'
import BackIcon from '../../assets/icons/myicons/back.svg'
import EditIcon from '../../assets/icons/myicons/edit.svg'
import TrashIcon from '../../assets/icons/myicons/trash.svg'
import { useMobx } from '../useMobx'
import { PurchaseStore } from './store'
import './styles.module.css'

const Purchase = observer(() => {
  const { id } = useParams()
  const state = useMobx(new PurchaseStore(), [id])

  if (!state.purchase) return <></>

  const onDeleteClick = async () => {
    if (!confirm('Are you sure you want to delete this purchase?')) return

    await purchasesApi.delete(state.purchase.id)
    location.href = `/accounts/${state.purchase.accountId}`
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
          to={`/purchases/${state.purchase.id}/edit?back=${location.pathname}`}
          styleName="btn"
        >
          <EditIcon />
        </Link>
      </div>
      <div styleName="title">
        <h1>Purchase</h1>
      </div>
      <div styleName="purchase">
        <div styleName="name">
          {state.purchase.store?.alias ?? state.purchase.store?.name}
        </div>
        <div styleName="value">
          -{state.purchase.value}
          {state.purchase.account?.currency?.symbol ??
            state.purchase.account?.currency?.code}
        </div>
        <div styleName="date">
          {DateTime.fromJSDate(state.purchase.date).toLocaleString({
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </div>
      </div>
    </div>
  )
})

export default Purchase
