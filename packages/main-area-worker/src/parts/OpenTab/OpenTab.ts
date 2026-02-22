import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'

type OpenTabPayload = Omit<Tab, 'id' | 'isPreview'> & Partial<Pick<Tab, 'id' | 'isPreview'>>

export const openTab = (state: MainAreaState, groupId: number, tab: OpenTabPayload): MainAreaState => {
  const normalizedTab = {
    ...tab,
    isPreview: tab.isPreview ?? false,
  }
  const newTab: Tab = 'id' in normalizedTab && normalizedTab.id !== undefined ? (normalizedTab as Tab) : { ...normalizedTab, id: Id.create() }

  const { layout } = state
  const { groups } = layout
  const updatedGroups = groups.map((group) => {
    if (group.id === groupId) {
      const newTabs = [...group.tabs, newTab]
      return {
        ...group,
        activeTabId: newTab.id,
        isEmpty: newTabs.length === 0,
        tabs: newTabs,
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
