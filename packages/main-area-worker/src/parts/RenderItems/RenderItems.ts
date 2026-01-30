import { ViewletCommand } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getMainAreaVirtualDom } from '../GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'

export const renderItems = (oldState: MainAreaState, newState: MainAreaState): any => {
  const { layout, splitButtonEnabled, uid } = newState
  const dom = getMainAreaVirtualDom(layout, splitButtonEnabled)
  return [ViewletCommand.SetDom2, uid, dom]
}
