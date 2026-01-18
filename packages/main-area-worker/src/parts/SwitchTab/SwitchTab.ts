import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const switchTab = (state: MainAreaState, groupId: number, tabId: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const updatedGroups = groups.map((group) => {
    if (group.id === groupId) {
      const tabExists = group.tabs.some((tab) => tab.id === tabId)
      if (tabExists) {
        return {
          ...group,
          activeTabId: tabId,
        }
      }
    }
    return group
  })

  return {
    ...state,
    layout: {
      ...layout,
      groups: updatedGroups,
    },
  }
}
