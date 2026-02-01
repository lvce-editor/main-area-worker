import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const newFile = async (state: MainAreaState): Promise<MainAreaState> => {
  Assert.object(state)

  const { layout } = state
  const { activeGroupId, groups } = layout

  // Find the active group
  let activeGroup = activeGroupId === undefined ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)

  // If no active group exists, create one with an empty group first
  let newState = state
  if (!activeGroup) {
    const emptyGroupState = ensureActiveGroup(state, '')
    newState = emptyGroupState
    activeGroup = newState.layout.groups.find((group) => group.id === newState.layout.activeGroupId)
  }

  if (!activeGroup) {
    return state
  }

  // Get previous active tab ID for viewlet switching
  const previousTabId = getActiveTabId(newState)

  // Use ensureActiveGroup to create a tab with proper initialization
  // This ensures the tab has editorUid set up correctly
  const newStateWithTab = ensureActiveGroup(newState, 'untitled')

  // Update the new tab to have title 'Untitled' instead of 'untitled'
  const tabId = getActiveTabId(newStateWithTab)!
  const tabWithNewFile = findTabById(newStateWithTab, tabId)

  if (!tabWithNewFile) {
    return newStateWithTab
  }

  // Update tab title
  const updatedState = {
    ...newStateWithTab,
    layout: {
      ...newStateWithTab.layout,
      groups: newStateWithTab.layout.groups.map((group) => ({
        ...group,
        tabs: group.tabs.map((tab) => (tab.id === tabId ? { ...tab, title: 'Untitled', uri: undefined } : tab)),
      })),
    },
  }

  // Calculate bounds: use main area bounds minus 35px for tab height
  const TAB_HEIGHT = 35
  const bounds = {
    height: updatedState.height - TAB_HEIGHT,
    width: updatedState.width,
    x: updatedState.x,
    y: updatedState.y + TAB_HEIGHT,
  }

  const stateWithViewlet = ViewletLifecycle.createViewletForTab(updatedState, tabId, 'editor.text', bounds)
  let intermediateState = stateWithViewlet

  // Switch viewlet (detach old, attach new if ready)
  const { newState: switchedState } = ViewletLifecycle.switchViewlet(intermediateState, previousTabId, tabId)
  intermediateState = switchedState

  const { uid } = updatedState
  set(uid, state, intermediateState)

  // Get the tab to extract editorUid
  const tabWithViewlet = findTabById(intermediateState, tabId)

  if (!tabWithViewlet) {
    return intermediateState
  }

  const { editorUid } = tabWithViewlet.tab

  if (editorUid === -1) {
    throw new Error(`invalid editorUid`)
  }

  await createViewlet('EditorText', editorUid, tabId, bounds, 'untitled:///1')

  // After viewlet is created, get the latest state and mark it as ready
  const { newState: latestState } = get(uid)
  const readyState = ViewletLifecycle.handleViewletReady(latestState, editorUid)

  return readyState
}
