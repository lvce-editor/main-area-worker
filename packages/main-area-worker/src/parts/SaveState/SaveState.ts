import type { SavedState } from '../SavedState/SavedState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const saveState = (uid: number): SavedState => {
  Assert.number(uid)
  const value = StatusBarStates.get(uid)
  const { newState } = value
  const { statusBarItemsLeft, statusBarItemsRight } = newState
  return {
    itemsLeft: statusBarItemsLeft,
    itemsRight: statusBarItemsRight,
  }
}
