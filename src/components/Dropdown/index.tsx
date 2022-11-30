import { ActiveDraggableContext } from '@dnd-kit/core/dist/components/DndContext'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { SelectVariant } from '../../utils/form'
import './styles.module.css'

interface Props {
  variants: SelectVariant[]
  selected: string
  onChange: (val: string) => any
}

const Dropdown = observer(({ variants, selected, onChange }: Props) => {
  const [active, setActive] = useState(true)
  const selectedName = variants.find((v) => v.code === selected)?.name as string
  return (
    <div styleName="wrapper">
      {!active && <span>{selectedName}</span>}
      {active && (
        <div>
          {variants.map((v) => (
            <div key={v.code} styleName="element">
              {v.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

export default Dropdown
