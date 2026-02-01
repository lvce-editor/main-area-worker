import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'
import { createEmptyGroup } from '../CreateEmptyGroup/CreateEmptyGroup.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import * as Id from '../Id/Id.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { openTab } from '../OpenTab/OpenTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const newFile = async (state: MainAreaState): Promise<MainAreaState> => {
  Assert.object(state)

  const { layout, uid } = state
  const { activeGroupId, groups } = layout

  // Find the active group
  const activeGroup = activeGroupId === undefined ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)

  // Prepare initial state
  let newState = state
  let targetGroupId: number

  if (activeGroup) {
    targetGroupId = activeGroup.id
  } else {
    // No active group, create an empty one
    newState = createEmptyGroup(state, '', 0)
    const updatedActiveGroupId = newState.layout.activeGroupId
    if (!updatedActiveGroupId) {
      return state
    }
    targetGroupId = updatedActiveGroupId

    // Remove the tab that createEmptyGroup created, we'll add our own
    newState = {
      ...newState,
      layout: {
        ...newState.layout,
        groups: newState.layout.groups.map((group) => {
          if (group.id === targetGroupId) {
            return {
              ...group,
              activeTabId: undefined,
              tabs: [],
            }
          }
          return group
        }),
      },
    }
  }

  // Get previous active tab ID for viewlet switching
  const previousTabId = getActiveTabId(newState)

  // Create a new empty tab
  const tabId = Id.create()
  const editorUid = Id.create()
  const newTab: Tab = {
    editorType: 'text',
    editorUid,
    errorMessage: '',
    icon: '',
    id: tabId,
    isDirty: false,
    language: 'plaintext',
    loadingState: 'loading',
    title: 'Untitled',
    uri: 'untitled:///1',
  }

  const stateWithNewTab = openTab(newState, targetGroupId, newTab)

  // Calculate bounds: use main area bounds minus tab height
  const bounds = {
    height: stateWithNewTab.height - stateWithNewTab.tabHeight,
    width: stateWithNewTab.width,
    x: stateWithNewTab.x,
    y: stateWithNewTab.y + stateWithNewTab.tabHeight,
  }

  const stateWithViewlet = ViewletLifecycle.createViewletForTab(stateWithNewTab, tabId, 'EditorText', bounds)
  let intermediateState = stateWithViewlet

  // Switch viewlet (detach old, attach new if ready)
  const { newState: switchedState } = ViewletLifecycle.switchViewlet(intermediateState, previousTabId, tabId)
  intermediateState = switchedState

  set(uid, state, intermediateState)

  // Get the tab to extract editorUid
  const tabWithViewlet = findTabById(intermediateState, tabId)

  if (!tabWithViewlet) {
    return intermediateState
  }

  const { editorUid: actualEditorUid } = tabWithViewlet.tab

  if (actualEditorUid === -1) {
    throw new Error(`invalid editorUid`)
  }

  await createViewlet('Editor', actualEditorUid, tabId, bounds, newTab.uri || '')

  // After viewlet is created, get the latest state and mark it as ready
  const { newState: latestState } = get(uid)
  const readyState = ViewletLifecycle.handleViewletReady(latestState, actualEditorUid)

  return readyState
}
