import { noop } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { Link, useParams } from 'react-router-dom'

import BackIcon from '../../assets/icons/myicons/back.svg'
import EditIcon from '../../assets/icons/myicons/edit.svg'
import TrashIcon from '../../assets/icons/myicons/trash.svg'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import { useMobx } from '../useMobx'
import { StoreUpdateStore } from './store'
import './styles.module.css'

const StoreUpdate = observer(() => {
  const { id } = useParams()
  const state = useMobx(new StoreUpdateStore(), [id])

  if (!state.store) return <></>
  return (
    <div styleName="wrapper">
      <div styleName="top">
        <Link
          to={new URLSearchParams(location.search).get('back') ?? '/stores'}
          styleName="btn"
        >
          <BackIcon />
        </Link>

        <div styleName="btn right" onClick={noop}>
          <TrashIcon />
        </div>
        <Link
          to={`/transfers/${state.store.id}/edit?back=${location.pathname}`}
          styleName="btn"
        >
          <EditIcon />
        </Link>
      </div>
      <div styleName="title">
        <h1>Store details</h1>
      </div>
      <div styleName="formWrapper">
        <div styleName="form">
          <TextInput label="Name" {...state.data.getInputProps('name')} />
          <TextInput label="Alias" {...state.data.getInputProps('alias')} />
        </div>
      </div>
      <div styleName="button">
        <Button onClick={() => state.saveOrder()} text="Save" primary />
      </div>
    </div>
  )
})

export default StoreUpdate
