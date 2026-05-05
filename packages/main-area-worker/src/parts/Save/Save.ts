import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import { get } from '../MainAreaStates/MainAreaStates.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

export const save = async (state: MainAreaState): Promise<MainAreaState> => {
  const stateFromStore = get(state.uid)
  const requestedActiveTabData = getActiveTab(state)
  let currentState = state

  if (stateFromStore) {
    const storedState = stateFromStore.newState
    const storedActiveTabData = getActiveTab(storedState)
    if (storedActiveTabData) {
      if (
        !requestedActiveTabData ||
        storedActiveTabData.tab.id === requestedActiveTabData.tab.id ||
        storedActiveTabData.tab.uri === requestedActiveTabData.tab.uri
      ) {
        currentState = storedState
      }
    }
  }

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
    return get(state.uid)?.newState ?? currentState
  }

  const editorState = await saveEditor(tab.editorUid)
  const latestState = get(state.uid)?.newState ?? currentState
  if (editorState?.modified) {
    return latestState
  }

  if (tab.uri) {
    await RendererWorker.handleModifiedStatusChange(tab.uri, false)
  }
  const stateAfterModifiedStatusChange = get(state.uid)?.newState ?? latestState

  return updateTab(stateAfterModifiedStatusChange, tab.id, { isDirty: false })
}
