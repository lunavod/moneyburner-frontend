import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import accountsApi from '../../api/account'
import storesApi from '../../api/store'
import BackIcon from '../../assets/icons/myicons/back.svg'
import { PurchaseFormData } from '../../pages/PurchaseCreate/store'
import FormState from '../../utils/form'
import Button from '../Button'
import ResourceSelect from '../ResourceSelect'
import TextInput from '../TextInput'
import './styles.module.css'

// interface Props {}

const PurchaseForm = observer(
  ({
    data,
    accountId,
    submit,
    title,
  }: {
    data: FormState<PurchaseFormData>
    accountId?: string
    submit: () => void
    title: string
  }) => {
    const [shopError, setShopError] = useState(false)
    const [accountError, setAccountError] = useState(false)
    const [valueError, setValueError] = useState(false)

    const onDateChange = (s: string) => {
      const date = DateTime.fromFormat(s, 'dd.MM.yyyy')
      data.set('_date', s)
      if (!date.isValid) return

      const fullDate = DateTime.fromISO(data.form.dateTime).set({
        year: date.year,
        month: date.month,
        day: date.day,
      })

      data.set('dateTime', fullDate.toISO())
    }

    const onTimeChange = (s: string) => {
      const date = DateTime.fromFormat(s, 'HH:mm')
      data.set('_time', s)
      if (!date.isValid) return

      const fullDate = DateTime.fromISO(data.form.dateTime).set({
        hour: date.hour,
        minute: date.minute,
      })

      data.set('dateTime', fullDate.toISO())
    }

    const findShops = useCallback(async () => {
      const stores = await storesApi.find()
      return stores.map((s) => ({ id: s.id, name: s.alias ?? s.name }))
    }, [storesApi])

    const createShop = useCallback(
      ({ name }: { name: string }) => storesApi.create({ name }),
      [storesApi],
    )

    const findAccounts = useCallback(
      async () => accountsApi.find(),
      [accountsApi],
    )

    const onValueBlur = () => {
      const value = data.form.value
      if (!value) return

      const valueNum = Number(value)
      if (Number.isNaN(valueNum)) {
        setValueError(true)
        return
      }

      console.log(valueNum.toString())

      setValueError(false)
      data.set('value', valueNum.toString())
    }

    const onShopBlur = () => {
      if (!data.form.shopId) setShopError(true)
      else setShopError(false)
    }

    const onAccountBlur = () => {
      if (!data.form.accountId) setAccountError(true)
      else setAccountError(false)
    }

    return (
      <div styleName="wrapper">
        <div styleName="top">
          <Link
            to={new URLSearchParams(location.search).get('back') ?? '/'}
            styleName="back"
          >
            <BackIcon />
          </Link>
        </div>
        <div styleName="title">
          <h1>{title}</h1>
        </div>
        <div styleName="formWrapper">
          <div styleName="form">
            <ResourceSelect
              onChange={(v) => data.set('accountId', v[0].code)}
              find={findAccounts}
              label="Account"
              selected={data.form.accountId ? [data.form.accountId] : []}
              single
              disabled={!!accountId}
              onBlur={onAccountBlur}
              error={accountError ? 'Account is required' : undefined}
            />
            <ResourceSelect
              onChange={(v) => data.set('shopId', v[0].code)}
              find={findShops}
              create={createShop}
              label="Shop"
              selected={data.form.shopId ? [data.form.shopId] : []}
              single
              onBlur={onShopBlur}
              error={shopError ? 'Shop is required' : undefined}
            />

            <div styleName="dateTime">
              <TextInput
                label="Date"
                value={data.form._date}
                onChange={onDateChange}
                error={
                  DateTime.fromFormat(data.form._date, 'dd.MM.yyyy').isValid
                    ? undefined
                    : 'Invalid date'
                }
              />
              <TextInput
                label="Time"
                value={data.form._time}
                onChange={onTimeChange}
                error={
                  DateTime.fromFormat(data.form._time, 'HH:mm').isValid
                    ? undefined
                    : 'Invalid time'
                }
              />
            </div>
            <TextInput
              label="Value"
              {...data.getInputProps('value')}
              type="number"
              onBlur={onValueBlur}
              error={valueError ? 'Invalid value' : undefined}
            />
          </div>
        </div>
        <div styleName="button">
          <Button text="Save" onClick={() => submit()} primary />
        </div>
      </div>
    )
  },
)

export default PurchaseForm
