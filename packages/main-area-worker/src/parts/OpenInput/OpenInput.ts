import type { MainAreaState, EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'
import type { OpenInputOptions } from '../OpenInputOptions/OpenInputOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getEditorInputEditorType } from '../GetEditorInputEditorType/GetEditorInputEditorType.ts'
import { getEditorInputTitle } from '../GetEditorInputTitle/GetEditorInputTitle.ts'
import { getEditorInputUri } from '../GetEditorInputUri/GetEditorInputUri.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

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
  const shouldRetryExistingTab = existingTab && existingTab.tab.loadingState === 'error'
  if (existingTab && !shouldRetryExistingTab) {
    const focusedState = focusEditorGroup(state, existingTab.groupId)
    return switchTab(focusedState, existingTab.groupId, existingTab.tab.id)
  }

  const previousTabId = getActiveTabId(state)
  const stateFromStore = get(uid)
  let currentState: MainAreaState

  if (stateFromStore) {
    const storedState = stateFromStore.newState
    const storedTabCount = storedState.layout.groups.reduce((sum: number, group: EditorGroup) => sum + group.tabs.length, 0)
    const passedTabCount = state.layout.groups.reduce((sum: number, group: EditorGroup) => sum + group.tabs.length, 0)

    if (storedTabCount > passedTabCount) {
      currentState = storedState
    } else {
      currentState = state
      set(uid, state, state)
    }
  } else {
    currentState = state
    set(uid, state, state)
  }

  let tabId: number
  let stateWithTab: MainAreaState
  if (shouldRetryExistingTab && existingTab) {
    const focusedState = focusEditorGroup(currentState, existingTab.groupId)
    stateWithTab = updateTab(focusedState, existingTab.tab.id, {
      editorInput,
      errorMessage: '',
      loadingState: 'loading',
      title,
      uri,
    })
    tabId = existingTab.tab.id
  } else {
    stateWithTab = ensureActiveGroup(currentState, uri, preview, title, editorType, editorInput)
    tabId = getActiveTabId(stateWithTab)!
  }

  set(uid, state, stateWithTab)

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

    try {
      const newTab = findTabById(readyState, tabId)
      if (newTab && newTab.tab.uri) {
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
      }
    } catch {
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