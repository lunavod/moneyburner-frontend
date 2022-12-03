import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'

import StoreIcon from '../../assets/icons/myicons/store.svg'
import { useMobx } from '../useMobx'
import { StoresListStore } from './store'
import './styles.module.css'

const StoresList = observer(() => {
  const state = useMobx(new StoresListStore())

  return (
    <div styleName="wrapper">
      <div styleName="title">
        <h1>Stores</h1>
      </div>
      <div styleName="stores">
        {state.stores.map((store) => (
          <Link to={`/stores/${store.id}`} key={store.id} styleName="store">
            <div styleName="icon">
              <StoreIcon />
            </div>
            <div styleName="info">
              <div styleName="mainName">{store.alias ?? store.name}</div>
              {store.alias && <div styleName="secondaryName">{store.name}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
})

export default StoresList
