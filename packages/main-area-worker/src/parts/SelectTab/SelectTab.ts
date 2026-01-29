import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import * as GetNextRequestId from '../GetNextRequestId/GetNextRequestId.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import { startContentLoading } from '../StartContentLoading/StartContentLoading.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

const shouldLoadContent = (tab: Tab): boolean => {
  // Load if:
  // - Has a path (file-based tab)
  // - Not already loaded or currently loading
  if (!tab.uri) {
    return false
  }
  if (tab.loadingState === 'loading') {
    return false
  }
  if (tab.loadingState === 'loaded' && tab.content) {
    return false
  }
  // Don't load if content already exists
  if (tab.content) {
    return false
  }
  return true
}

const getActiveTabId = (state: MainAreaState): number | undefined => {
  const { layout } = state
  const { activeGroupId, groups } = layout
  const activeGroup = groups.find((g) => g.id === activeGroupId)
  return activeGroup?.activeTabId
}

export const selectTab = async (state: MainAreaState, groupIndex: number, index: number): Promise<MainAreaState> => {
  const { layout, uid } = state
  const { groups } = layout

  // Validate indexes
  if (groupIndex < 0 || groupIndex >= groups.length) {
    return state
  }

  const group = groups[groupIndex]
  if (index < 0 || index >= group.tabs.length) {
    return state
  }

  const tab = group.tabs[index]
  const groupId = group.id
  const tabId = tab.id

  // Return same state if this group and tab are already active
  if (layout.activeGroupId === groupId && group.activeTabId === tabId) {
    return state
  }

  // Get previous active tab ID for viewlet switching
  const previousTabId = getActiveTabId(state)

  // Check if we need to load content for the newly selected tab
  const needsLoading = shouldLoadContent(tab)
  const requestId = needsLoading ? GetNextRequestId.getNextRequestId() : 0

  // Update the groups array with the new active tab and active group
  // Also set loading state if needed
  const updatedGroups = groups.map((g, i) => {
    if (i !== groupIndex) {
      return {
        ...g,
        focused: false,
      }
    }

    // This is the group being selected
    const updatedTabs = needsLoading
      ? g.tabs.map((t): Tab => {
          if (t.id === tabId) {
            return {
              ...t,
              errorMessage: '',
              loadingState: 'loading',
            }
          }
          return t
        })
      : g.tabs

    return {
      ...g,
      activeTabId: tabId,
      focused: true,
      tabs: updatedTabs,
    }
  })

  let newState: MainAreaState = {
    ...state,
    layout: {
      ...layout,
      activeGroupId: groupId,
      groups: updatedGroups,
    },
  }

  // Switch viewlet: detach old, attach new (if ready)
  const { commands: switchCommands, newState: stateWithViewlet } = ViewletLifecycle.switchViewlet(newState, previousTabId, tabId)
  newState = stateWithViewlet

  // If new tab's viewlet isn't ready yet, trigger creation (idempotent)
  const newTab = newState.layout.groups[groupIndex].tabs[index]

  if (!newTab.loadingState || newTab.loadingState === 'loading') {
    try {
      // Query RendererWorker for viewlet module ID
      // @ts-ignore
      const viewletModuleId = await RendererWorker.invoke('Layout.getModuleId', newTab.uri)
      if (viewletModuleId) {
        // Calculate bounds: use main area bounds minus 35px for tab height
        const TAB_HEIGHT = 35
        const bounds = {
          height: newState.height - TAB_HEIGHT,
          width: newState.width,
          x: newState.x,
          y: newState.y + TAB_HEIGHT,
        }
        const createdState = ViewletLifecycle.createViewletForTab(newState, tabId, viewletModuleId, bounds)
        newState = createdState

        // Store updated state before creating viewlet
        MainAreaStates.set(uid, state, newState)

        // Execute viewlet commands if any
        if (switchCommands.length > 0) {
          await ExecuteViewletCommands.executeViewletCommands(switchCommands)
        }

        // Get the tab to extract editorUid for viewlet creation
        const tabWithViewlet = findTabById(newState, tabId)
        if (tabWithViewlet) {
          const { editorUid } = tabWithViewlet.tab
          if (editorUid !== -1 && newTab.uri) {
            // Create the actual viewlet instance
            await createViewlet(viewletModuleId, editorUid, tabId, bounds, newTab.uri)

            // Mark viewlet as ready
            newState = ViewletLifecycle.handleViewletReady(newState, editorUid)
            MainAreaStates.set(uid, state, newState)
          }
        }

        // Start loading content in the background if needed
        if (needsLoading && tab.uri) {
          const latestState = await startContentLoading(state, newState, tabId, tab.uri, requestId)
          return latestState
        }

        return newState
      }
    } catch {
      // Viewlet creation is optional - silently ignore if RendererWorker isn't available
    }
  }

  MainAreaStates.set(uid, state, newState)

  // Execute viewlet commands if any
  if (switchCommands.length > 0) {
    await ExecuteViewletCommands.executeViewletCommands(switchCommands)
  }

  // Start loading content in the background if needed
  if (needsLoading && tab.uri) {
    const latestState = await startContentLoading(state, newState, tabId, tab.uri, requestId)
    return latestState
  }

  return newState
}
