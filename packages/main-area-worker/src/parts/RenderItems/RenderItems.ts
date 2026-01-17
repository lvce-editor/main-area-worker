import { ViewletCommand } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getStatusBarVirtualDom } from '../GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'

export const renderItems = (oldState: MainAreaState, newState: MainAreaState): any => {
  const { statusBarItemsLeft, statusBarItemsRight, uid } = newState
  const dom = getStatusBarVirtualDom(statusBarItemsLeft, statusBarItemsRight)
  return [ViewletCommand.SetDom2, uid, dom]
}
