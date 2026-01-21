import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'

export const openTab = (state: MainAreaState, groupId: number, tab: Omit<Tab, 'id'> | Tab): MainAreaState => {
  const newTab: Tab = 'id' in tab && tab.id !== undefined ? tab : { ...tab, id: Id.create() }

  const { layout } = state
  const { groups } = layout
  const updatedGroups = groups.map((group) => {
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
      ...layout,
      groups: updatedGroups,
    },
  }
}
