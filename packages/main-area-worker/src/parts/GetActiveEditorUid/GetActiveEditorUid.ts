import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'

export const getActiveEditorUid = (state: MainAreaState): number => {
  const activeTab = getActiveTab(state)
  const editorUid = activeTab?.tab.editorUid
  if (editorUid === undefined || editorUid < 0) {
    throw new Error('no active editor found')
  }
  return editorUid
}
