import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as MainAreaState from '../MainAreaState/MainAreaState.ts'
import * as UpdateArray from '../UpdateArray/UpdateArray.ts'

export const itemLeftUpdate = (state: Readonly<MainAreaState.MainAreaState>, newItem: Readonly<StatusBarItem>): MainAreaState.MainAreaState => {
  return {
    ...state,
    statusBarItemsLeft: UpdateArray.updateArray([...state.statusBarItemsLeft], newItem),
  }
}
