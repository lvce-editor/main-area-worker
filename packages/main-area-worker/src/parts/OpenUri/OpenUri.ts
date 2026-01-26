/* eslint-disable prefer-destructuring */
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import * as GetNextRequestId from '../GetNextRequestId/GetNextRequestId.ts'
import * as Id from '../Id/Id.ts'
import { openTab } from '../OpenTab/OpenTab.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { startContentLoading } from '../StartContentLoading/StartContentLoading.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

const getActiveTabId = (state: MainAreaState): number | undefined => {
  const { layout } = state
  const { activeGroupId, groups } = layout
  const activeGroup = groups.find((g) => g.id === activeGroupId)
  return activeGroup?.activeTabId
}

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
  const activeGroup = activeGroupId === undefined ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)

  // Generate a request ID for content loading
  const requestId = GetNextRequestId.getNextRequestId()

  // If no active group exists, create one
  if (!activeGroup) {
    const groupId = Id.create()
    const title = PathDisplay.getLabel(uri)
    const tabId = Id.create()
    const newTab = {
      content: '',
      editorType: 'text' as const,
      id: tabId,
      isDirty: false,
      loadingState: 'loading' as const,
      loadRequestId: requestId,
      path: uri,
      title,
    }
    const newGroup = {
      activeTabId: newTab.id,
      focused: true,
      id: groupId,
      size: 100,
      tabs: [newTab],
    }

    let newState: MainAreaState = {
      ...state,
      layout: {
        ...layout,
        activeGroupId: groupId,
        groups: [...groups, newGroup],
      },
    }

    // Eagerly create viewlet (safe - no visible side effects)
    if (viewletModuleId) {
      // TODO: Calculate proper bounds
      const bounds = { height: 600, width: 800, x: 0, y: 0 }
      const { commands: createCommands, newState: stateWithViewlet } = ViewletLifecycle.createViewletForTab(newState, tabId, viewletModuleId, bounds)
      newState = stateWithViewlet

      // Switch viewlet (detach old, attach new if ready)
      const { commands: switchCommands, newState: switchedState } = ViewletLifecycle.switchViewlet(newState, previousTabId, tabId)
      newState = switchedState

      // Execute viewlet commands (pass uid so create can handle attach)
      await ExecuteViewletCommands.executeViewletCommands([...createCommands, ...switchCommands], state.uid)
    }

    // Start loading content
    return startContentLoading(state, newState, tabId, uri, requestId)
  }

  // Create a new tab with the URI in the active group
  const title = PathDisplay.getLabel(uri)
  const tabId = Id.create()
  const newTab = {
    content: '',
    editorType: 'text' as const,
    id: tabId,
    isDirty: false,
    loadingState: 'loading' as const,
    loadRequestId: requestId,
    path: uri,
    title,
  }

  let newState = openTab(state, activeGroup.id, newTab)

  // Eagerly create viewlet (safe - no visible side effects)
  if (viewletModuleId) {
    // TODO: Calculate proper bounds
    const bounds = { height: 600, width: 800, x: 0, y: 0 }
    const { commands: createCommands, newState: stateWithViewlet } = ViewletLifecycle.createViewletForTab(newState, tabId, viewletModuleId, bounds)
    newState = stateWithViewlet

    // Switch viewlet (detach old, attach new if ready)
    const { commands: switchCommands, newState: switchedState } = ViewletLifecycle.switchViewlet(newState, previousTabId, tabId)
    newState = switchedState

    // Execute viewlet commands (pass uid so create can handle attach)
    await ExecuteViewletCommands.executeViewletCommands([...createCommands, ...switchCommands], state.uid)
  }

  return startContentLoading(state, newState, tabId, uri, requestId)
}
