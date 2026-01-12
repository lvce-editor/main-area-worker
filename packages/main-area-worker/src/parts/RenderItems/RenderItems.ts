import { ViewletCommand } from '@lvce-editor/constants'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getStatusBarVirtualDom } from '../GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'

export const renderItems = (oldState: StatusBarState, newState: StatusBarState): any => {
  const { statusBarItemsLeft, statusBarItemsRight, uid } = newState
  const dom = getStatusBarVirtualDom(statusBarItemsLeft, statusBarItemsRight)
  return [ViewletCommand.SetDom2, uid, dom]
}
