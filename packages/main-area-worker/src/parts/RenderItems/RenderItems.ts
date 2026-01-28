import { ViewletCommand } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getMainAreaVirtualDom } from '../GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'

export const renderItems = (oldState: MainAreaState, newState: MainAreaState): any => {
  const { layout, uid } = newState
  const dom = getMainAreaVirtualDom(layout)
  console.log('render items', uid)
  return [ViewletCommand.SetDom2, uid, dom]
}
