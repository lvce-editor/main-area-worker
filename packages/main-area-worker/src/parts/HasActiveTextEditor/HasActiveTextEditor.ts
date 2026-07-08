import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'

export const hasActiveTextEditor = (state: MainAreaState): boolean => {
  const activeTab = getActiveTab(state)
  return activeTab?.tab.editorInput?.type === 'editor'
}
