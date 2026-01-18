import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'

export const handleClickCloseTab = (state: MainAreaState, rawGroupId: string, rawTabId: string): MainAreaState => {
  const groupId = Number.parseInt(rawGroupId)
  const tabId = Number.parseInt(rawTabId)
  return closeTab(state, groupId, tabId)
}
