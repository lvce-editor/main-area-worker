import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../MainAreaState/MainAreaState.ts'

export const openTab = (state: MainAreaState, groupId: string, tab: Omit<Tab, 'id'>): MainAreaState => {
  const newTab: Tab = {
    ...tab,
    id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
  }

  const groups = state.layout.groups.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        activeTabId: newTab.id,
        tabs: [...group.tabs, newTab],
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
