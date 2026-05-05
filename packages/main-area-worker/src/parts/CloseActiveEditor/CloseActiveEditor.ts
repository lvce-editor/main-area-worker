import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTabAndSave } from '../CloseTabAndSave/CloseTabAndSave.ts'
import { getFocusedGroup } from '../GetFocusedGroup/GetFocusedGroup.ts'

export const closeActiveEditor = async (state: MainAreaState): Promise<MainAreaState> => {
  const focusedGroup = getFocusedGroup(state)
  if (!focusedGroup) {
    return state
  }

  const { activeTabId } = focusedGroup
  if (activeTabId === undefined) {
    return state
  }

  return closeTabAndSave(state, focusedGroup.id, activeTabId)
}
