import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { findTabByEditorUid } from '../FindTabByEditorUid/FindTabByEditorUid.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

export const handleEditorModified = (state: MainAreaState, editorUid: number): MainAreaState => {
  const tab = findTabByEditorUid(state, editorUid)
  if (!tab) {
    return state
  }

  return updateTab(state, tab.id, { isDirty: true })
}
