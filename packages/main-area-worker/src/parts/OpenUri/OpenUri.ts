import type { MainAreaState, EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'
import { getOptionUriOptions } from '../GetOptionUriOptions/GetOptionUriOptions.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const openUri = async (state: MainAreaState, options: OpenUriOptions | string): Promise<MainAreaState> => {
  Assert.object(state)

  const { uid } = state

  const uri = getOptionUriOptions(options)

  // Check if a tab with this URI already exists in the passed-in state
  const existingTab = findTabByUri(state, uri)
  if (existingTab) {
    // Tab exists, switch to it and focus its group
    const focusedState = focusEditorGroup(state, existingTab.groupId)
    return switchTab(focusedState, existingTab.groupId, existingTab.tab.id)
  }

  // Get previous active tab ID for viewlet switching
  const previousTabId = getActiveTabId(state)

  // Check if there's existing state in the global store
  const stateFromStore = get(uid)
  let currentState: MainAreaState

  if (stateFromStore) {
    const storedState = stateFromStore.newState
    // Use the stored state if it has more tabs than the passed-in state
    // (indicating concurrent calls have already added tabs)
    // Otherwise use the passed-in state (test setup with initial data)
    const storedTabCount = storedState.layout.groups.reduce((sum: number, g: EditorGroup) => sum + g.tabs.length, 0)
    const passedTabCount = state.layout.groups.reduce((sum: number, g: EditorGroup) => sum + g.tabs.length, 0)

    if (storedTabCount > passedTabCount) {
      // Stored state has more tabs - concurrent calls have added tabs
      currentState = storedState
    } else {
      // Passed-in state has same or more tabs, use it (likely fresh test setup)
      currentState = state
      set(uid, state, state)
    }
  } else {
    // No state in store yet, register the passed-in state
    currentState = state
    set(uid, state, state)
  }

  // Add tab to state BEFORE any async calls to prevent race conditions
  const newState = ensureActiveGroup(currentState, uri)
  const tabId = getActiveTabId(newState)!

  // Save state immediately after adding tab
  set(uid, state, newState)

  const viewletModuleId = await getViewletModuleId(uri)

  // After async call, get the latest state to account for any concurrent changes
  const { newState: stateAfterModuleId } = get(uid)

  if (!viewletModuleId) {
    // TODO display some kind of errro that editor couldn't be opened
    return stateAfterModuleId
  }

  // Calculate bounds: use main area bounds minus tab height
  const bounds = {
    height: stateAfterModuleId.height - stateAfterModuleId.tabHeight,
    width: stateAfterModuleId.width,
    x: stateAfterModuleId.x,
    y: stateAfterModuleId.y + stateAfterModuleId.tabHeight,
  }
  const stateWithViewlet = ViewletLifecycle.createViewletForTab(stateAfterModuleId, tabId, viewletModuleId, bounds)
  let intermediateState1 = stateWithViewlet

  // Switch viewlet (detach old, attach new if ready)
  const { newState: switchedState } = ViewletLifecycle.switchViewlet(intermediateState1, previousTabId, tabId)
  intermediateState1 = switchedState

  set(uid, state, intermediateState1)

  // Get the tab to extract editorUid
  const tabWithViewlet = findTabById(intermediateState1, tabId)

  if (!tabWithViewlet) {
    return intermediateState1
  }

  const { editorUid } = tabWithViewlet.tab

  if (editorUid === -1) {
    throw new Error(`invalid editorUid`)
  }

  await createViewlet(viewletModuleId, editorUid, tabId, bounds, uri)

  // After viewlet is created, get the latest state and mark it as ready
  // This ensures we have any state updates that occurred during viewlet creation
  const { newState: latestState } = get(uid)

  // Attachment is handled automatically by virtual DOM reference nodes
  const readyState = ViewletLifecycle.handleViewletReady(latestState, editorUid)

  // Save state before async icon request
  set(uid, state, readyState)

  // Request file icon for the newly opened tab
  try {
    const newTab = findTabById(readyState, tabId)
    if (newTab && newTab.tab.uri) {
      const { newFileIconCache } = await getFileIconsForTabs([newTab.tab], readyState.fileIconCache)

      // After async call, get the latest state again
      const { newState: stateBeforeIconUpdate } = get(uid)

      const icon = newFileIconCache[newTab.tab.uri] || ''

      // Update the tab with the icon in the latest state
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

      // Save the state with icon update so concurrent calls can see it
      set(uid, state, stateWithIcon)

      return stateWithIcon
    }
  } catch {
    // If icon request fails, continue without icon
  }

  // Get final latest state
  const { newState: finalState } = get(uid)
  return finalState
}
