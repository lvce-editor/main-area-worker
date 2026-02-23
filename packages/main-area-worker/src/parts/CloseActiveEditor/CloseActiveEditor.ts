import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'
import { getFocusedGroup } from '../GetFocusedGroup/GetFocusedGroup.ts'

export const closeActiveEditor = (state: MainAreaState): MainAreaState => {
  const focusedGroup = getFocusedGroup(state)
  if (!focusedGroup) {
    return state
  }

  const { activeTabId } = focusedGroup
  if (activeTabId === undefined) {
    return state
  }

  return closeTab(state, focusedGroup.id, activeTabId)
}
