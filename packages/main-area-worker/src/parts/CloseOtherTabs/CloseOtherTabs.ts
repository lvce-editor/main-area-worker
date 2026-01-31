import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeOtherTabs = (state: MainAreaState, groupId: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const group = groups.find((g) => g.id === groupId)
  if (!group) {
    return state
  }

  const { activeTabId } = group
  if (activeTabId === undefined) {
    return state
  }

  const newGroups = groups.map((g) => {
    if (g.id === groupId) {
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
    ...state,
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}
