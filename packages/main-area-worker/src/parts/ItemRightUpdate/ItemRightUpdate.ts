import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as MainAreaState from '../MainAreaState/MainAreaState.ts'
import * as UpdateArray from '../UpdateArray/UpdateArray.ts'

export const itemRightUpdate = (state: Readonly<MainAreaState.MainAreaState>, newItem: Readonly<StatusBarItem>): MainAreaState.MainAreaState => {
  const { statusBarItemsRight } = state
  const newStatusBarItemsRight = UpdateArray.updateArray([...statusBarItemsRight], newItem)
  return {
    ...state,
    statusBarItemsRight: newStatusBarItemsRight,
  }
}
