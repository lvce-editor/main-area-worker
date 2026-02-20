import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeTab = (state: MainAreaState, groupId: number, tabId: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  // Find the group to close the tab from
  const groupIndex = groups.findIndex((g) => g.id === groupId)
  if (groupIndex === -1) {
    return state
  }

  const group = groups[groupIndex]
  // Check if the tab exists in the group
  const tabWasRemoved = group.tabs.some((tab) => tab.id === tabId)
  if (!tabWasRemoved) {
    return state
  }

  const newGroups = groups.map((grp) => {
    if (grp.id === groupId) {
      const newTabs = grp.tabs.filter((tab) => tab.id !== tabId)

      let newActiveTabId = grp.activeTabId
      if (grp.activeTabId === tabId) {
        const tabIndex = grp.tabs.findIndex((tab) => tab.id === tabId)
        if (newTabs.length > 0) {
          newActiveTabId = newTabs[Math.min(tabIndex, newTabs.length - 1)].id
        } else {
          newActiveTabId = undefined
        }
      }

      return {
        ...grp,
        activeTabId: newActiveTabId,
        isEmpty: newTabs.length === 0,
        tabs: newTabs,
      }
    }
    return grp
  })

  // If the group has no tabs left after closing, remove the group
  const groupIsNowEmpty = newGroups[groupIndex].tabs.length === 0
  if (groupIsNowEmpty) {
    const remainingGroups = newGroups.filter((group) => group.id !== groupId)

    // If there are remaining groups, redistribute sizes
    if (remainingGroups.length > 0) {
      const redistributedGroups = remainingGroups.map((grp) => ({
        ...grp,
        size: Math.round(100 / remainingGroups.length),
      }))

      const newActiveGroupId = activeGroupId === groupId ? remainingGroups[0]?.id : activeGroupId

      return {
        ...state,
        layout: {
          ...layout,
          activeGroupId: newActiveGroupId,
          groups: redistributedGroups,
        },
      }
    }

    // If no remaining groups, return empty layout
    return {
      ...state,
      layout: {
        ...layout,
        activeGroupId: undefined,
        groups: [],
      },
    }
  }

  return {
    ...state,
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}
