import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'

export const closeActiveEditor = (state: MainAreaState): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const focusedGroup = groups.find((group) => group.focused)
  if (!focusedGroup) {
    return state
  }

  const { activeTabId } = focusedGroup
  if (activeTabId === undefined) {
    return state
  }

  return closeTab(state, focusedGroup.id, activeTabId)
}
