import { ViewletCommand } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getMainAreaVirtualDom } from '../GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'

export const renderItems = (oldState: MainAreaState, newState: MainAreaState): any => {
  const { initial, layout, splitButtonEnabled, uid, width } = newState
  if (initial) {
    return [ViewletCommand.SetDom2, uid, []]
  }
  const dom = getMainAreaVirtualDom(layout, splitButtonEnabled, width)
  return [ViewletCommand.SetDom2, uid, dom]
}
