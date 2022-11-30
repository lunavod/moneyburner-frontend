import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'

import CoinsIcon from '../../assets/icons/myicons/coins.svg'
import CreditCardIcon from '../../assets/icons/myicons/credit-card.svg'
import { useMobx } from '../useMobx'
import { AccountsListStore } from './store'
import './styles.module.css'

const AccountsList = observer(() => {
  const state = useMobx(new AccountsListStore())

  return (
    <div styleName="wrapper">
      <div styleName="title">
        <h1>Accounts</h1>
      </div>
      <h1 styleName="total">Total balance: {state.totalBalance}</h1>
      <div styleName="accounts">
        {state.accounts.map((account) => (
          <Link
            to={`/accounts/${account.id}`}
            key={account.id}
            styleName="account"
          >
            <div styleName="icon">
              {account.type === 'CASH' && <CoinsIcon />}
              {account.type === 'CREDIT_CARD' && <CreditCardIcon />}
            </div>
            <div styleName="info">
              <span styleName="number">
                {account.currentValue}
                {account.currency?.symbol ?? account.currency?.code}
              </span>
              <span styleName="name">{account.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
})

export default AccountsList
