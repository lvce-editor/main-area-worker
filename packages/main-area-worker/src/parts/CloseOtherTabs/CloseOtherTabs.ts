import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'

export const closeOtherTabs = (state: MainAreaState, groupId?: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  const targetGroupId = groupId ?? activeGroupId
  if (targetGroupId === undefined) {
    return state
  }

  const group = groups.find((g) => g.id === targetGroupId)
  if (!group) {
    return state
  }

  const { activeTabId } = group
  if (activeTabId === undefined) {
    return state
  }

  const closedTabs = group.tabs
    .map((tab, tabIndex) => ({
      group,
      groupIndex: groups.findIndex((g) => g.id === targetGroupId),
      tab,
      tabIndex,
    }))
    .filter((entry) => entry.tab.id !== activeTabId)

  const newGroups = groups.map((g) => {
    if (g.id === targetGroupId) {
      const newTabs = g.tabs.filter((tab) => tab.id === activeTabId)
      return {
        ...g,
        activeTabId,
        isEmpty: newTabs.length === 0,
        tabs: newTabs,
      }
    }
    return g
  })

  return {
    ...addClosedTabs(state, closedTabs),
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}
