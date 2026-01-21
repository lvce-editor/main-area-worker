import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import * as LoadTabContent from '../LoadTabContent/LoadTabContent.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import { startContentLoading } from '../StartContentLoading/StartContentLoading.ts'

const shouldLoadContent = (tab: Tab): boolean => {
  // Load if:
  // - Has a path (file-based tab)
  // - Not already loaded or currently loading
  if (!tab.path) {
    return false
  }
  if (tab.loadingState === 'loading') {
    return false
  }
  if (tab.loadingState === 'loaded' && tab.content) {
    return false
  }
  return true
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

  // Check if we need to load content for the newly selected tab
  const needsLoading = shouldLoadContent(tab)
  const requestId = needsLoading ? LoadTabContent.getNextRequestId() : 0

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
      ? g.tabs.map((t) => {
          if (t.id === tabId) {
            return {
              ...t,
              errorMessage: undefined,
              loadingState: 'loading' as const,
              loadRequestId: requestId,
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

  const newState: MainAreaState = {
    ...state,
    layout: {
      ...layout,
      activeGroupId: groupId,
      groups: updatedGroups,
    },
  }
  MainAreaStates.set(uid, state, newState)

  // Start loading content in the background if needed
  if (needsLoading && tab.path) {
    const latestState = await startContentLoading(newState, tabId, tab.path, requestId)
    return latestState
  }

  return newState
}
