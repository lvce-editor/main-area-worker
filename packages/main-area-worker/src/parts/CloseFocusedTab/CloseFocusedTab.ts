import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTabAndSave } from '../CloseTabAndSave/CloseTabAndSave.ts'

const isFocused = (group: EditorGroup): boolean => {
  return group.focused
}

export const closeFocusedTab = async (state: MainAreaState): Promise<MainAreaState> => {
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

  return closeTabAndSave(state, focusedGroup.id, activeTabId)
}
