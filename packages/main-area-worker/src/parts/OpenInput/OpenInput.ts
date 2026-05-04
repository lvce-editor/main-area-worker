import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { MainAreaState, EditorGroup, EditorType, Tab } from '../MainAreaState/MainAreaState.ts'
import type { OpenInputOptions } from '../OpenInputOptions/OpenInputOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getEditorInputEditorType } from '../GetEditorInputEditorType/GetEditorInputEditorType.ts'
import { getEditorInputTitle } from '../GetEditorInputTitle/GetEditorInputTitle.ts'
import { getEditorInputUri } from '../GetEditorInputUri/GetEditorInputUri.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

const getTabCount = (state: MainAreaState): number => {
  return state.layout.groups.reduce((sum: number, group: EditorGroup) => sum + group.tabs.length, 0)
}

const getCurrentState = (state: MainAreaState): MainAreaState => {
  const { uid } = state
  const stateFromStore = get(uid)
  if (!stateFromStore) {
    set(uid, state, state)
    return state
  }

  const storedState = stateFromStore.newState
  if (getTabCount(storedState) > getTabCount(state)) {
    return storedState
  }

  set(uid, state, state)
  return state
}

const getStateWithTab = (
  currentState: MainAreaState,
  editorInput: OpenInputOptions['editorInput'],
  existingTab: ReturnType<typeof findTabByUri>,
  shouldRetryExistingTab: boolean,
  uri: string,
  preview: boolean,
  title: string,
  editorType: EditorType,
): { stateWithTab: MainAreaState; tabId: number } => {
  if (shouldRetryExistingTab && existingTab) {
    const focusedState = focusEditorGroup(currentState, existingTab.groupId)
    return {
      stateWithTab: updateTab(focusedState, existingTab.tab.id, {
        editorInput,
        errorMessage: '',
        loadingState: 'loading',
        title,
        uri,
      }),
      tabId: existingTab.tab.id,
    }
  }

  const stateWithTab = ensureActiveGroup(currentState, uri, preview, title, editorType, editorInput)
  return {
    stateWithTab,
    tabId: getActiveTabId(stateWithTab)!,
  }
}

const updateTabIcon = async (uid: number, state: MainAreaState, readyState: MainAreaState, tabId: number): Promise<MainAreaState | undefined> => {
  const newTab = findTabById(readyState, tabId)
  if (!newTab || !newTab.tab.uri) {
    return undefined
  }

  try {
    const { newFileIconCache } = await getFileIconsForTabs([newTab.tab], readyState.fileIconCache)
    const { newState: stateBeforeIconUpdate } = get(uid)
    const icon = newFileIconCache[newTab.tab.uri] || ''
    const stateWithIcon = {
      ...stateBeforeIconUpdate,
      fileIconCache: newFileIconCache,
      layout: {
        ...stateBeforeIconUpdate.layout,
        groups: stateBeforeIconUpdate.layout.groups.map((group: EditorGroup) => ({
          ...group,
          tabs: group.tabs.map((tab: Tab) => (tab.id === tabId ? { ...tab, icon } : tab)),
        })),
      },
    }
    set(uid, state, stateWithIcon)
    return stateWithIcon
  } catch {
    return undefined
  }
}

const isLocalEditorInput = (editorInput: EditorInput): editorInput is Extract<EditorInput, { type: 'editor' }> => {
  if (editorInput.type !== 'editor') {
    return false
  }
  return editorInput.uri.startsWith('file://') || !editorInput.uri.includes('://')
}

const shouldCheckDirectoryEditorInput = (editorInput: EditorInput): editorInput is Extract<EditorInput, { type: 'editor' }> => {
  if (!isLocalEditorInput(editorInput)) {
    return false
  }
  const baseName = editorInput.uri.slice(editorInput.uri.lastIndexOf('/') + 1)
  return baseName.endsWith('/') || (baseName !== '' && !baseName.includes('.'))
}

const isDirectoryEditorInput = async (editorInput: OpenInputOptions['editorInput']): Promise<boolean> => {
  if (!shouldCheckDirectoryEditorInput(editorInput)) {
    return false
  }
  try {
    const type = await RendererWorker.invoke('FileSystem.stat', editorInput.uri)
    return type === DirentType.Directory
  } catch {
    return false
  }
}

export const openInput = async (state: MainAreaState, options: OpenInputOptions): Promise<MainAreaState> => {
  Assert.object(state)
  Assert.object(options)

  const { uid } = state
  const { editorInput } = options
  const preview = options.preview ?? false
  const uri = getEditorInputUri(editorInput)
  const title = getEditorInputTitle(editorInput)
  const editorType = getEditorInputEditorType(editorInput)

  const existingTab = findTabByUri(state, uri)
  const shouldRetryExistingTab = !!existingTab && existingTab.tab.loadingState === 'error'
  if (existingTab && !shouldRetryExistingTab) {
    const focusedState = focusEditorGroup(state, existingTab.groupId)
    return switchTab(focusedState, existingTab.groupId, existingTab.tab.id)
  }

  const previousTabId = getActiveTabId(state)
  const currentState = getCurrentState(state)
  const { stateWithTab, tabId } = getStateWithTab(currentState, editorInput, existingTab, shouldRetryExistingTab, uri, preview, title, editorType)

  set(uid, state, stateWithTab)

  if (await isDirectoryEditorInput(editorInput)) {
    const { newState: latestState } = get(uid)
    const errorState = updateTab(latestState, tabId, {
      errorMessage: 'Expected a file but received a folder',
      loadingState: 'error',
    })
    set(uid, state, errorState)
    return errorState
  }

  try {
    const viewletModuleId = await getViewletModuleIdForEditorInput(editorInput)
    const { newState: stateAfterModuleId } = get(uid)

    if (!viewletModuleId) {
      return updateTab(stateAfterModuleId, tabId, {
        errorMessage: 'Could not determine editor type for this URI',
        loadingState: 'error',
      })
    }

    const bounds = {
      height: stateAfterModuleId.height - stateAfterModuleId.tabHeight,
      width: stateAfterModuleId.width,
      x: stateAfterModuleId.x,
      y: stateAfterModuleId.y + stateAfterModuleId.tabHeight,
    }
    const stateWithViewlet = ViewletLifecycle.createViewletForTab(stateAfterModuleId, tabId, viewletModuleId, bounds)
    let intermediateState = stateWithViewlet

    const { newState: switchedState } = ViewletLifecycle.switchViewlet(intermediateState, previousTabId, tabId)
    intermediateState = switchedState

    set(uid, state, intermediateState)

    const tabWithViewlet = findTabById(intermediateState, tabId)
    if (!tabWithViewlet) {
      return intermediateState
    }

    const { editorUid } = tabWithViewlet.tab
    if (editorUid === -1) {
      throw new Error('invalid editorUid')
    }

    await createViewlet(viewletModuleId, editorUid, tabId, bounds, uri)

    const { newState: latestState } = get(uid)
    const readyState = ViewletLifecycle.handleViewletReady(latestState, editorUid)

    set(uid, state, readyState)

    const stateWithIcon = await updateTabIcon(uid, state, readyState, tabId)
    if (stateWithIcon) {
      return stateWithIcon
    }

    const { newState: finalState } = get(uid)
    return finalState
  } catch (error) {
    const { newState: latestState } = get(uid)
    const errorMessage = error instanceof Error ? error.message : 'Failed to open URI'
    const errorState = updateTab(latestState, tabId, {
      errorMessage,
      loadingState: 'error',
    })
    set(uid, state, errorState)
    return errorState
  }
}
