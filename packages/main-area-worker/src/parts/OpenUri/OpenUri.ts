import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getOptionUriOptions } from '../GetOptionUriOptions/GetOptionUriOptions.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const openUri = async (state: MainAreaState, options: OpenUriOptions | string): Promise<MainAreaState> => {
  Assert.object(state)

  const { uid } = state

  const uri = getOptionUriOptions(options)

  // Check if a tab with this URI already exists
  const existingTab = findTabByUri(state, uri)
  if (existingTab) {
    // Tab exists, switch to it and focus its group
    const focusedState = focusEditorGroup(state, existingTab.groupId)
    return switchTab(focusedState, existingTab.groupId, existingTab.tab.id)
  }

  // Get previous active tab ID for viewlet switching
  const previousTabId = getActiveTabId(state)

  const newState = ensureActiveGroup(state, uri)
  const tabId = getActiveTabId(newState)!

  const viewletModuleId = await getViewletModuleId(uri)

  if (!viewletModuleId) {
    // TODO display some kind of errro that editor couldn't be opened
    return newState
  }

  // Calculate bounds: use main area bounds minus 35px for tab height
  const TAB_HEIGHT = 35
  const bounds = {
    height: newState.height - TAB_HEIGHT,
    width: newState.width,
    x: newState.x,
    y: newState.y + TAB_HEIGHT,
  }
  const stateWithViewlet = ViewletLifecycle.createViewletForTab(newState, tabId, viewletModuleId, bounds)
  let intermediateState1 = stateWithViewlet

  // Switch viewlet (detach old, attach new if ready)
  const { newState: switchedState } = ViewletLifecycle.switchViewlet(intermediateState1, previousTabId, tabId)
  intermediateState1 = switchedState

  set(uid, state, intermediateState1)

  // @ts-ignore

  // Get the tab to extract editorUid
  const tabWithViewlet = findTabById(intermediateState1, tabId)

  if (!tabWithViewlet) {
    console.log('tab not found')
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

  console.log({ readyState })

  return readyState
}
