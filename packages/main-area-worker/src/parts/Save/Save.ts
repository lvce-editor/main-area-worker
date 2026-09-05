import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../Tab/Tab.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import { get } from '../MainAreaStates/MainAreaStates.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

const settingsUri = 'app://settings.json'

const saveEditorAndHandleSettingsChange = async (tab: Tab, applicationId?: string) => {
  const editorState = await saveEditor(tab.editorUid)
  if (!editorState?.modified && tab.uri === settingsUri) {
    await ApplicationRpc.invoke(applicationId, 'Layout.handleSettingsChanged')
  }
  return editorState
}

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
  const { uid } = state
  const requestedActiveTabData = getActiveTab(state)
  const currentState = getLatestStoredState(uid, state, requestedActiveTabData?.tab.id, requestedActiveTabData?.tab.uri, !requestedActiveTabData)

  const activeTabData = getActiveTab(currentState)
  if (!activeTabData) {
    return currentState
  }

  const { tab } = activeTabData
  if (tab.loadingState === 'loading') {
    return currentState
  }

  if (!tab.isDirty) {
    await saveEditorAndHandleSettingsChange(tab, state.applicationId)
    return getLatestStoredState(uid, currentState, tab.id, tab.uri)
  }

  const editorState = await saveEditorAndHandleSettingsChange(tab, state.applicationId)
  const latestState = getLatestStoredState(uid, currentState, tab.id, tab.uri)
  if (editorState?.modified) {
    return latestState
  }

  if (tab.uri) {
    await ApplicationRpc.invoke(state.applicationId, 'Main.handleModifiedStatusChange', tab.uri, false)
  }
  const stateAfterModifiedStatusChange = getLatestStoredState(uid, latestState, tab.id, tab.uri)

  return updateTab(stateAfterModifiedStatusChange, tab.id, { isDirty: false })
}
