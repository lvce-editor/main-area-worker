import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import { get } from '../MainAreaStates/MainAreaStates.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

export const save = async (state: MainAreaState): Promise<MainAreaState> => {
  const currentState = get(state.uid)?.newState ?? state
  const activeTabData = getActiveTab(currentState)
  if (!activeTabData) {
    return currentState
  }

  const { tab } = activeTabData
  if (tab.loadingState === 'loading') {
    return currentState
  }

  if (!tab.isDirty) {
    await saveEditor(tab.editorUid)
    return currentState
  }

  const editorState = await saveEditor(tab.editorUid)
  if (!editorState || editorState.modified) {
    return currentState
  }

  return updateTab(currentState, tab.id, { isDirty: false })
}
