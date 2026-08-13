import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { getGroupById } from '../GetGroupById/GetGroupById.ts'
import { withGroups } from '../WithGroups/WithGroups.ts'

export const closeTabsRight = (state: MainAreaState, groupId?: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  const targetGroupId = groupId ?? activeGroupId
  if (targetGroupId === -1) {
    return state
  }

  const group = getGroupById(state, targetGroupId)
  if (!group) {
    return state
  }

  const { activeTabId, tabs } = group
  if (activeTabId === -1) {
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

  const groupIndex = groups.findIndex((g) => g.id === targetGroupId)
  const closedTabs = tabs.slice(activeTabIndex + 1).map((tab, index) => ({
    group,
    groupIndex,
    tab,
    tabIndex: activeTabIndex + index + 1,
  }))

  const newGroups = groups.map((g) => {
    if (g.id === targetGroupId) {
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
