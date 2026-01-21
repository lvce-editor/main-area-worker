import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeTabsRight = (state: MainAreaState, groupId: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const group = groups.find((g) => g.id === groupId)
  if (!group) {
    return state
  }

  const { activeTabId, tabs } = group
  if (activeTabId === undefined) {
    return state
  }

  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTabId)
  if (activeTabIndex === -1) {
    return state
  }

  const newTabs = tabs.slice(0, activeTabIndex + 1)

  if (newTabs.length === tabs.length) {
    return state
  }

  const newGroups = groups.map((g) => {
    if (g.id === groupId) {
      return {
        ...g,
        tabs: newTabs,
      }
    }
    return g
  })

  return {
    ...state,
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}
