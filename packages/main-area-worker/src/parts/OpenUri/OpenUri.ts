/* eslint-disable prefer-destructuring */
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import * as Id from '../Id/Id.ts'
import * as LoadTabContent from '../LoadTabContent/LoadTabContent.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { openTab } from '../OpenTab/OpenTab.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'

const startContentLoading = (uid: number, tabId: number, path: string, requestId: number): void => {
  const loadContent = async (): Promise<void> => {
    try {
      const currentState = get(uid) as unknown as MainAreaState | undefined
      if (!currentState) {
        return
      }
      const getLatestState = (): MainAreaState => (get(uid) as unknown as MainAreaState | undefined) ?? currentState
      const newState = await LoadTabContent.loadTabContentAsync(tabId, path, requestId, getLatestState)
      const oldState = get(uid) as unknown as MainAreaState | undefined
      if (oldState) {
        set(uid, oldState, newState)
      }
    } catch {
      // Silently ignore errors - the tab may have been closed or the component unmounted
    }
  }
  void loadContent()
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

  // Find the active group (by activeGroupId or focused flag)
  const { layout, uid } = state
  const { activeGroupId, groups } = layout
  const activeGroup = activeGroupId === undefined ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)

  // Generate a request ID for content loading
  const requestId = LoadTabContent.getNextRequestId()

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

    const newState: MainAreaState = {
      ...state,
      layout: {
        ...layout,
        activeGroupId: groupId,
        groups: [...groups, newGroup],
      },
    }

    // Start loading content
    startContentLoading(uid, tabId, uri, requestId)

    return newState
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

  const newState = openTab(state, activeGroup.id, newTab)

  // Start loading content
  startContentLoading(uid, tabId, uri, requestId)

  return newState
}
