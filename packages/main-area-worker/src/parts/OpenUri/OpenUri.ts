import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { set } from '../MainAreaStates/MainAreaStates.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const openUri = async (state: MainAreaState, options: OpenUriOptions | string): Promise<MainAreaState> => {
  Assert.object(state)

  let uri = ''
  if (typeof options === 'string') {
    uri = options
  } else {
    uri = options.uri
  }

  // Check if a tab with this URI already exists
  const existingTab = findTabByUri(state, uri)
  if (existingTab) {
    // Tab exists, switch to it and focus its group
    const focusedState = focusEditorGroup(state, existingTab.groupId)
    return switchTab(focusedState, existingTab.groupId, existingTab.tab.id)
  }

  // Get previous active tab ID for viewlet switching
  const previousTabId = getActiveTabId(state)

  // Query RendererWorker for viewlet module ID (optional, may fail in tests)
  let viewletModuleId: string | undefined
  try {
    // @ts-ignore
    viewletModuleId = await RendererWorker.invoke('Layout.getModuleId', uri)
  } catch {
    // Viewlet creation is optional - silently ignore if RendererWorker isn't available
  }

  const { newState, tabId } = ensureActiveGroup(state, uri)

  if (!viewletModuleId) {
    // Viewlet creation is optional - return state with just the tab created
    set(newState.uid, state, newState)
    return newState
  }

  // TODO: Calculate proper bounds
  const bounds = { height: 600, width: 800, x: 0, y: 0 }
  const { newState: stateWithViewlet } = ViewletLifecycle.createViewletForTab(newState, tabId, viewletModuleId, bounds)
  let intermediateState1 = stateWithViewlet

  // Switch viewlet (detach old, attach new if ready)
  const { newState: switchedState } = ViewletLifecycle.switchViewlet(intermediateState1, previousTabId, tabId)
  intermediateState1 = switchedState

  set(intermediateState1.uid, state, intermediateState1)

  // @ts-ignore

  // Get the tab to extract editorUid
  const tabWithViewlet = intermediateState1.layout.groups.flatMap((g) => g.tabs).find((t) => t.id === tabId)

  if (!tabWithViewlet) {
    return intermediateState1
  }

  await RendererWorker.invoke('Layout.createViewlet', viewletModuleId, tabWithViewlet.editorUid, tabId, bounds, uri)

  // After viewlet is created, mark it as ready
  // Attachment is handled automatically by virtual DOM reference nodes
  const { newState: readyState } = ViewletLifecycle.handleViewletReady(intermediateState1, tabWithViewlet.editorUid, tabWithViewlet.editorUid)
  set(readyState.uid, state, readyState)
  return readyState
}
