import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeTab = (state: MainAreaState, groupId: number, tabId: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout

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
  return {
    ...state,
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}
