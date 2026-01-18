import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeTab = (state: MainAreaState, groupId: number, tabId: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  const newGroups = groups.map((group) => {
    if (group.id === groupId) {
      const newTabs = group.tabs.filter((tab) => tab.id !== tabId)

      let newActiveTabId = group.activeTabId
      if (group.activeTabId === tabId) {
        const tabIndex = group.tabs.findIndex((tab) => tab.id === tabId)
        if (newTabs.length > 0) {
          newActiveTabId = newTabs[Math.min(tabIndex, newTabs.length - 1)].id
        } else {
          newActiveTabId = undefined
        }
      }

      return {
        ...group,
        activeTabId: newActiveTabId,
        tabs: newTabs,
      }
    }
    return group
  })

  // If the group has no tabs left and there are other groups, remove the group
  const groupWithNoTabs = newGroups.find((group) => group.id === groupId && group.tabs.length === 0)
  if (groupWithNoTabs && newGroups.length > 1) {
    const remainingGroups = newGroups.filter((group) => group.id !== groupId)

    const redistributedGroups = remainingGroups.map((group) => ({
      ...group,
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

  return {
    ...state,
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}
