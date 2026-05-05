import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import { get } from '../MainAreaStates/MainAreaStates.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

const getLatestStoredState = (
  uid: number,
  fallbackState: MainAreaState,
  referenceTabId: number | undefined,
  referenceTabUri: string | undefined,
  allowMissingReference = false,
): MainAreaState => {
  const stateFromStore = get(uid)
  if (!stateFromStore) {
    return fallbackState
  }
  const storedState = stateFromStore.newState
  const storedActiveTabData = getActiveTab(storedState)
  if (!storedActiveTabData) {
    return fallbackState
  }
  if (allowMissingReference && referenceTabId === undefined && referenceTabUri === undefined) {
    return storedState
  }
  if (storedActiveTabData.tab.id === referenceTabId) {
    return storedState
  }
  if (referenceTabUri && storedActiveTabData.tab.uri === referenceTabUri) {
    return storedState
  }
  return fallbackState
}

export const save = async (state: MainAreaState): Promise<MainAreaState> => {
  const requestedActiveTabData = getActiveTab(state)
  const currentState = getLatestStoredState(
    state.uid,
    state,
    requestedActiveTabData?.tab.id,
    requestedActiveTabData?.tab.uri,
    !requestedActiveTabData,
  )

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
    return getLatestStoredState(state.uid, currentState, tab.id, tab.uri)
  }

  const editorState = await saveEditor(tab.editorUid)
  const latestState = getLatestStoredState(state.uid, currentState, tab.id, tab.uri)
  if (editorState?.modified) {
    return latestState
  }

  if (tab.uri) {
    await RendererWorker.handleModifiedStatusChange(tab.uri, false)
  }
  const stateAfterModifiedStatusChange = getLatestStoredState(state.uid, latestState, tab.id, tab.uri)

  return updateTab(stateAfterModifiedStatusChange, tab.id, { isDirty: false })
}
