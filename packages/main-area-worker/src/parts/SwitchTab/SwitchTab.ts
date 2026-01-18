import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const switchTab = (state: MainAreaState, groupId: number | string, tabId: number | string): MainAreaState => {
  const groups = state.layout.groups.map((group) => {
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
      ...state.layout,
      groups,
    },
  }
}
