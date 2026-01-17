import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const itemLeftCreate = (state: MainAreaState, name: string, text: string, tooltip: string): MainAreaState => {
  const { statusBarItemsLeft } = state
  const newItem: StatusBarItem = {
    elements: [{ type: 'text', value: text }],
    name,
    tooltip,
  }
  const newStatusBarItemsLeft = [...statusBarItemsLeft, newItem]
  return {
    ...state,
    statusBarItemsLeft: newStatusBarItemsLeft,
  }
}
