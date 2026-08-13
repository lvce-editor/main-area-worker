import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { getGroupById } from '../GetGroupById/GetGroupById.ts'
import { withGroups } from '../WithGroups/WithGroups.ts'

export const closeTabsRight = (state: MainAreaState, groupId?: number, tabId?: number): MainAreaState => {
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
  const targetTabId = tabId ?? activeTabId
  if (targetTabId === -1) {
    return state
  }

  const targetTabIndex = tabs.findIndex((tab) => tab.id === targetTabId)
  if (targetTabIndex === -1) {
    return state
  }

  const newTabs = tabs.slice(0, targetTabIndex + 1)

  if (newTabs.length === tabs.length) {
    return state
  }

  const groupIndex = groups.findIndex((g) => g.id === targetGroupId)
  const closedTabs = tabs.slice(targetTabIndex + 1).map((tab, index) => ({
    group,
    groupIndex,
    tab,
    tabIndex: targetTabIndex + index + 1,
  }))

  const newGroups = groups.map((g) => {
    if (g.id === targetGroupId) {
      return {
        ...g,
        activeTabId: newTabs.some((tab) => tab.id === activeTabId) ? activeTabId : targetTabId,
        isEmpty: newTabs.length === 0,
        tabs: newTabs,
      }
    }
    return g
  })

  return withGroups(addClosedTabs(state, closedTabs), newGroups)
}
