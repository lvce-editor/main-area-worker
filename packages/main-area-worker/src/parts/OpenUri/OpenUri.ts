/* eslint-disable prefer-destructuring */
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { createEmptyGroup } from '../CreateEmptyGroup/CreateEmptyGroup.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import * as GetNextRequestId from '../GetNextRequestId/GetNextRequestId.ts'
import * as Id from '../Id/Id.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import { set } from '../MainAreaStates/MainAreaStates.ts'
import { openTab } from '../OpenTab/OpenTab.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
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

  // Find the active group (by activeGroupId or focused flag)
  const { layout } = state
  const { activeGroupId, groups } = layout
  let activeGroup = activeGroupId === undefined ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)

  // Generate a request ID for content loading
  const requestId = GetNextRequestId.getNextRequestId()

  // If no active group exists, create one
  let newState: MainAreaState
  let tabId: number
  if (activeGroup) {
    // Create a new tab with the URI in the active group
    const title = PathDisplay.getLabel(uri)
    tabId = Id.create()
    const newTab = {
      content: '',
      customEditorId: '',
      editorType: 'text' as const,
      editorUid: -1,
      errorMessage: '',
      id: tabId,
      isDirty: false,
      language: '',
      loadingState: 'loading' as const,
      loadRequestId: requestId,
      path: uri,
      title,
    }
    newState = openTab(state, activeGroup.id, newTab)
  } else {
    newState = createEmptyGroup(state, uri, requestId)
    activeGroup = newState.layout.groups.find((group) => group.id === newState.layout.activeGroupId)
    // Get the tab ID from the newly created group
    tabId = activeGroup!.tabs[0].id
  }

  if (!viewletModuleId) {
    // Viewlet creation is optional - return state with just the tab created
    set(newState.uid, state, newState)
    return newState
  }

  // TODO: Calculate proper bounds
  const bounds = { height: 600, width: 800, x: 0, y: 0 }
  const { commands: createCommands, newState: stateWithViewlet } = ViewletLifecycle.createViewletForTab(newState, tabId, viewletModuleId, bounds)
  let intermediateState1 = stateWithViewlet

  // Switch viewlet (detach old, attach new if ready)
  const { commands: switchCommands, newState: switchedState } = ViewletLifecycle.switchViewlet(intermediateState1, previousTabId, tabId)
  intermediateState1 = switchedState

  set(intermediateState1.uid, state, intermediateState1)

  // @ts-ignore
  const instanceId = Math.random() // TODO try to find a better way to get consistent integer ids (thread safe)

  await RendererWorker.invoke('Layout.createViewlet', viewletModuleId, requestId, tabId, bounds, uri)

  // After viewlet is created, mark it as ready
  // Attachment is handled automatically by virtual DOM reference nodes
  const { newState: readyState } = ViewletLifecycle.handleViewletReady(intermediateState1, editorUid, instanceId)
  set(readyState.uid, state, readyState)
  return readyState
}
