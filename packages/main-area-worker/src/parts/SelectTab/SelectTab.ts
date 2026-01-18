import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const selectTab = async (state: MainAreaState, groupIndex: number, index: number): Promise<MainAreaState> => {
  const { layout } = state
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

  // Update the groups array with the new active tab and active group
  const updatedGroups = groups.map((g, i) => ({
    ...g,
    activeTabId: i === groupIndex ? tabId : g.activeTabId,
    focused: i === groupIndex,
  }))

  return {
    ...state,
    layout: {
      ...layout,
      activeGroupId: groupId,
      groups: updatedGroups,
    },
  }
}
