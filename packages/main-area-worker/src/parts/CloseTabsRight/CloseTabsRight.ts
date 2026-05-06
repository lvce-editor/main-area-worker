import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { getGroupById } from '../GetGroupById/GetGroupById.ts'
import { withGroups } from '../WithGroups/WithGroups.ts'

export const closeTabsRight = (state: MainAreaState, groupId: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const group = getGroupById(state, groupId)
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

  const groupIndex = groups.findIndex((g) => g.id === groupId)
  const closedTabs = tabs.slice(activeTabIndex + 1).map((tab, index) => ({
    group,
    groupIndex,
    tab,
    tabIndex: activeTabIndex + index + 1,
  }))

  const newGroups = groups.map((g) => {
    if (g.id === groupId) {
      return {
        ...g,
        isEmpty: newTabs.length === 0,
        tabs: newTabs,
      }
    }
    return g
  })

  return withGroups(addClosedTabs(state, closedTabs), newGroups)
}
