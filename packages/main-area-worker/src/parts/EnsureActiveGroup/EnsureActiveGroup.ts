import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { createEmptyGroup } from '../CreateEmptyGroup/CreateEmptyGroup.ts'
import * as GetNextRequestId from '../GetNextRequestId/GetNextRequestId.ts'
import * as Id from '../Id/Id.ts'
import { openTab } from '../OpenTab/OpenTab.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

export const ensureActiveGroup = (state: MainAreaState, uri: string): { newState: MainAreaState; tabId: number } => {
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
    const newTab: Tab = {
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
      title,
      uri: uri,
    }
    newState = openTab(state, activeGroup.id, newTab)
  } else {
    newState = createEmptyGroup(state, uri, requestId)
    activeGroup = newState.layout.groups.find((group) => group.id === newState.layout.activeGroupId)
    // Get the tab ID from the newly created group
    tabId = activeGroup!.tabs[0].id
  }

  return { newState, tabId }
}
