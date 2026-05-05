import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTabAndSave } from '../CloseTabAndSave/CloseTabAndSave.ts'

export const handleClickCloseTab = async (state: MainAreaState, rawGroupIndex: string, rawIndex: string): Promise<MainAreaState> => {
  if (!rawGroupIndex || !rawIndex) {
    return state
  }
  const groupIndex = Number.parseInt(rawGroupIndex)
  const index = Number.parseInt(rawIndex)

  const { layout } = state
  const { groups } = layout

  // Validate indexes
  if (groupIndex < 0 || groupIndex >= groups.length) {
    return state
  }

  const group = groups[groupIndex]
  if (index < 0 || index >= group.tabs.length) {
    return state
  }

  const tab = group.tabs[index]
  const groupId = group.id
  const tabId = tab.id

  return closeTabAndSave(state, groupId, tabId)
}
