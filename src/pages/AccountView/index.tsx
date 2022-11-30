import clsx from 'clsx'
import { noop } from 'lodash-es'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { createContext, useContext, useRef } from 'react'
import { useParams } from 'react-router'

import moneyTransfersApi from '../../api/moneyTransfer'
import { MoneyTransfer } from '../../api/moneyTransfer/moneyTransfer'
import purchasesApi from '../../api/purchase'
import { Purchase } from '../../api/purchase/purchase'
import ArmMoneyIcon from '../../assets/icons/myicons/arm-coins.svg'
import CartIcon from '../../assets/icons/myicons/cart.svg'
import EditIcon from '../../assets/icons/myicons/edit.svg'
import ReceiptIcon from '../../assets/icons/myicons/receipt.svg'
import TrashIcon from '../../assets/icons/myicons/trash.svg'
import Button from '../../components/Button'
import Navbar from '../../components/Navbar'
import { useOnClickOutside } from '../../utils/hooks'
import { useMobx } from '../useMobx'
import { AccountViewStore } from './store'
import './styles.module.css'

const ScreenState = createContext(new AccountViewStore())

const AccountView = observer(() => {
  const { id } = useParams()
  const state = useMobx(new AccountViewStore(), [id])
  const navbarRef = useRef(null)
  const listRef = useRef(null)

  useOnClickOutside(listRef, () => state.setSelectedAction(null), navbarRef)

  if (!state.account) return <></>

  const account = state.account

  const symbol = state.symbol

  const onDeleteClick = async () => {
    if (!confirm('Are you sure?')) return
    if (!state.selectedAction) return
    await (state.selectedAction?.type === 'purchase'
      ? purchasesApi.delete(state.selectedAction.id)
      : moneyTransfersApi.delete(state.selectedAction.id))

    state.setSelectedAction(null)
    state.initialize([id as string])
  }

  return (
    <ScreenState.Provider value={state}>
      <div styleName="wrapper">
        <div styleName="accountInfo">
          <div styleName="card">
            <div styleName="top">
              <span>{account.name}</span>
              <span styleName="number">{account.leumiCardNumber}</span>
            </div>
            <div styleName="balanceWrapper">
              <span styleName="balance">
                <span styleName="name">Balance:</span>
                <span
                  styleName={clsx(
                    'value',
                    account.currentValue < 0 && 'negative',
                  )}
                >
                  {account.currentValue}
                  {symbol}
                </span>
              </span>
              {!!account.creditLimit && (
                <span styleName="untilReset">
                  {state.timeUntilReset} days until reset
                </span>
              )}
            </div>
            {!account.creditLimit && <div />}
            {!!account.creditLimit && (
              <div styleName="limitInfo">
                <span styleName="group">
                  <span styleName="value">{account.creditLimit}</span>
                  <span styleName="name">Limit</span>
                </span>
                <span styleName="group">
                  <span styleName="value">{account.limitUsed}</span>
                  <span styleName="name">Used</span>
                </span>
                <span styleName="group">
                  <span styleName="value">
                    {(account.creditLimit ?? 0) - (account.limitUsed ?? 0)}
                  </span>
                  <span styleName="name">Left</span>
                </span>
              </div>
            )}
          </div>
        </div>
        <div styleName="buttons">
          <Button
            text="Add purchase"
            to={`/purchases/new?accountId=${state.account.id}`}
            primary
          />
          <Button
            text="Add transfer"
            to={`/transfers/new?accountId=${state.account.id}`}
            secondary
          />
        </div>
        <div styleName="listWrapper">
          <div styleName="actionsList" ref={listRef}>
            {state.actions.map((action) =>
              'targetAccountId' in action ? (
                <MoneyTransferElement key={action.id} transfer={action} />
              ) : (
                <PurchaseElement
                  key={action.id}
                  purchase={action as Purchase}
                />
              ),
            )}
          </div>
        </div>
        {!!state.selectedAction && (
          <Navbar.Main styleName="navbar" ref={navbarRef}>
            <Navbar.Button
              icon={EditIcon}
              to={`/${
                state.selectedAction.type === 'purchase'
                  ? 'purchases'
                  : 'transfers'
              }/${state.selectedAction.id}/edit`}
            />
            <Navbar.Button icon={TrashIcon} onClick={onDeleteClick} />

            <Navbar.Button
              icon={ReceiptIcon}
              to={`/${
                state.selectedAction.type === 'purchase'
                  ? 'purchases'
                  : 'transfers'
              }/${state.selectedAction.id}`}
              fab
            />
          </Navbar.Main>
        )}
      </div>
    </ScreenState.Provider>
  )
})

export default AccountView

const MoneyTransferElement = observer(
  ({ transfer }: { transfer: MoneyTransfer }) => {
    const state = useContext(ScreenState)

    return (
      <div
        styleName={clsx(
          'row',
          state.selectedAction?.id === transfer.id && 'selected',
        )}
        onClick={() =>
          state.setSelectedAction({ id: transfer.id, type: 'transfer' })
        }
      >
        <div styleName="icon">
          <ArmMoneyIcon />
        </div>
        {!!transfer.increment && (
          <>
            <div styleName="info">
              <span styleName="store">Income</span>
              <span styleName="date">
                {DateTime.fromJSDate(transfer.createdAt).toLocaleString({
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <span styleName="value positive">
              +{transfer.increment}
              {state.symbol}
            </span>
          </>
        )}
        {!!transfer.decrement && (
          <>
            <div styleName="info">
              <span styleName="store">
                Transfer{!!transfer.name && ' to ' + transfer.name}
              </span>
              <span styleName="date">
                {DateTime.fromJSDate(transfer.createdAt).toLocaleString({
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <span styleName="value negative">
              -{transfer.decrement}
              {state.symbol}
            </span>
          </>
        )}
      </div>
    )
  },
)

const PurchaseElement = observer(({ purchase }: { purchase: Purchase }) => {
  const state = useContext(ScreenState)

  return (
    <div
      styleName={clsx(
        'row',
        state.selectedAction?.id === purchase.id && 'selected',
      )}
      onClick={() =>
        state.setSelectedAction({ id: purchase.id, type: 'purchase' })
      }
    >
      <div styleName="icon">
        <CartIcon />
      </div>

      <div styleName="info">
        <span styleName="store">
          {purchase.store?.alias ?? purchase.store?.name}
        </span>
        <span styleName="date">
          {DateTime.fromJSDate(purchase.date).toLocaleString({
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </span>
      </div>
      <div styleName="value">
        -{purchase.value}
        {state.symbol}
      </div>
    </div>
  )
})
