import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as MainAreaState from '../MainAreaState/MainAreaState.ts'

export const itemRightCreate = (state: Readonly<MainAreaState.MainAreaState>, newItem: Readonly<StatusBarItem>): MainAreaState.MainAreaState => {
  const { statusBarItemsRight } = state
  const newStatusBarItemsRight = [...statusBarItemsRight, newItem]
  return {
    ...state,
    statusBarItemsRight: newStatusBarItemsRight,
  }
}
