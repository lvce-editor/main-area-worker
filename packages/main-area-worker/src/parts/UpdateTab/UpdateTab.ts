import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const updateTab = (state: MainAreaState, tabId: number, updates: Partial<Tab>): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const updatedGroups = groups.map((group) => {
    const tabIndex = group.tabs.findIndex((t) => t.id === tabId)
    if (tabIndex === -1) {
      return group
    }
    const updatedTabs = group.tabs.map((tab, index) => {
      if (index === tabIndex) {
        return { ...tab, ...updates }
      }
      return tab
    })
    return { ...group, tabs: updatedTabs }
  })
  return {
    ...state,
    layout: {
      ...layout,
      groups: updatedGroups,
    },
  }
}
