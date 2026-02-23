import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'

const isFocused = (group: EditorGroup): boolean => {
  return group.focused
}

export const closeFocusedTab = (state: MainAreaState): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const focusedGroup = groups.find(isFocused)
  if (!focusedGroup) {
    return state
  }

  const { activeTabId } = focusedGroup
  if (activeTabId === undefined) {
    return state
  }

  return closeTab(state, focusedGroup.id, activeTabId)
}
