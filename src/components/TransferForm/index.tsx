import clsx from 'clsx'
import { noop } from 'lodash-es'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import accountsApi from '../../api/account'
import BackIcon from '../../assets/icons/myicons/back.svg'
import CheckIcon from '../../assets/icons/myicons/check.svg'
import Button from '../../components/Button'
import ResourceSelect from '../../components/ResourceSelect'
import TextInput from '../../components/TextInput'
import FormState from '../../utils/form'
import './styles.module.css'

const TransferForm = observer(
  ({
    data,
    submit,
    type,
    setType,
  }: {
    data: FormState<TransferFormData>
    submit: () => void
    type: TransferType
    setType: (type: TransferType) => void
  }) => {
    const findAccounts = useCallback(
      async () => accountsApi.find(),
      [accountsApi],
    )

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
          <h1>New transfer</h1>
        </div>
        <div styleName="switchWrapper">
          <div styleName="switch">
            <div
              styleName={clsx('element', type === 'internal' && 'active')}
              onClick={() => setType('internal')}
            >
              {type === 'internal' && <CheckIcon />}
              Internal
            </div>
            <div
              styleName={clsx('element', type === 'income' && 'active')}
              onClick={() => setType('income')}
            >
              {type === 'income' && <CheckIcon />}
              Income
            </div>
            <div
              styleName={clsx('element', type === 'payment' && 'active')}
              onClick={() => setType('payment')}
            >
              {type === 'payment' && <CheckIcon />}
              Payment
            </div>
          </div>
        </div>
        <div styleName="formWrapper">
          <div styleName="form">
            {(type === 'internal' || type === 'payment') && (
              <div styleName="group">
                <div styleName="label">Source account</div>
                <ResourceSelect
                  onChange={(v) => data.set('sourceAccountId', v[0].code)}
                  find={findAccounts}
                  label="Source"
                  selected={
                    data.form.sourceAccountId ? [data.form.sourceAccountId] : []
                  }
                  single
                />
                <TextInput {...data.getInputProps('decrement')} label="Value" />
              </div>
            )}

            {(type === 'income' || type === 'internal') && (
              <div styleName="group">
                <div styleName="label">Target account</div>
                <ResourceSelect
                  onChange={(v) => data.set('targetAccountId', v[0].code)}
                  find={findAccounts}
                  label="Target"
                  selected={
                    data.form.targetAccountId ? [data.form.targetAccountId] : []
                  }
                  single
                />
                <TextInput {...data.getInputProps('increment')} label="Value" />
              </div>
            )}

            {type === 'payment' && (
              <div styleName="group">
                <div styleName="label">Name</div>
                <TextInput
                  {...data.getInputProps('name')}
                  label="Recepient name"
                />
              </div>
            )}

            <div styleName="group">
              <div styleName="label">Date and time</div>
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
            </div>

            <Button primary text="Save" onClick={() => submit()} />
          </div>
        </div>
      </div>
    )
  },
)

export default TransferForm

export type TransferFormData = {
  sourceAccountId: string
  targetAccountId: string

  increment: string
  decrement: string

  name: string

  dateTime: string
  _date: string
  _time: string
}

export type TransferType = 'internal' | 'income' | 'payment'
