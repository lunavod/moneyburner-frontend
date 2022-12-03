import { noop } from 'lodash-es'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { Link, useParams } from 'react-router-dom'

import BackIcon from '../../assets/icons/myicons/back.svg'
import CartIcon from '../../assets/icons/myicons/cart.svg'
import EditIcon from '../../assets/icons/myicons/edit.svg'
import TrashIcon from '../../assets/icons/myicons/trash.svg'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import { useMobx } from '../useMobx'
import { StoreViewStore } from './store'
import './styles.module.css'

const StoreView = observer(() => {
  const { id } = useParams()
  const state = useMobx(new StoreViewStore(), [id])

  if (!state.store) return <></>
  return (
    <div styleName="wrapper">
      <div styleName="top">
        <Link to="/stores" styleName="btn left">
          <BackIcon />
        </Link>

        {!state.purchases.length && (
          <div styleName="btn" onClick={noop}>
            <TrashIcon />
          </div>
        )}
        <Link
          to={`/stores/${state.store.id}/edit?back=${location.pathname}`}
          styleName="btn"
        >
          <EditIcon />
        </Link>
      </div>
      <div styleName="title">
        <h1>Store details</h1>
      </div>
      <div styleName="storeInfo">
        <span styleName="primaryName">
          {state.store.alias || state.store.name}
        </span>
        {state.store.alias && (
          <span styleName="secondaryName">{state.store.name}</span>
        )}
        <span styleName="info">Purchases: {state.purchases.length}</span>
      </div>
      <div styleName="listWrapper">
        <div styleName="purchases">
          {state.purchases.map((purchase) => (
            <div styleName="row" key={purchase.id}>
              <div styleName="icon">
                <CartIcon />
              </div>

              <div styleName="info">
                <span styleName="store">{purchase.account?.name}</span>
                <span styleName="date">
                  {DateTime.fromJSDate(purchase.date).toLocaleString({
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div styleName="value">
                -{purchase.value}
                {purchase.account?.currency?.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default StoreView
