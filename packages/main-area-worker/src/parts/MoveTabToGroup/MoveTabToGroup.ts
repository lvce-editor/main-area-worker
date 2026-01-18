import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const moveTabToGroup = (
  state: MainAreaState,
  sourceGroupId: number,
  targetGroupId: number,
  tabId: number,
  targetIndex?: number,
): MainAreaState => {
  const sourceGroup = state.layout.groups.find((group) => group.id === sourceGroupId)
  const targetGroup = state.layout.groups.find((group) => group.id === targetGroupId)

  if (!sourceGroup || !targetGroup || sourceGroupId === targetGroupId) {
    return state
  }

  const tabToMove = sourceGroup.tabs.find((tab) => tab.id === tabId)
  if (!tabToMove) {
    return state
  }

  const updatedGroups = state.layout.groups.map((group) => {
    if (group.id === sourceGroupId) {
      const newTabs = group.tabs.filter((tab) => tab.id !== tabId)
      let newActiveTabId = group.activeTabId

      if (group.activeTabId === tabId) {
        if (newTabs.length > 0) {
          const removedIndex = group.tabs.findIndex((tab) => tab.id === tabId)
          newActiveTabId = newTabs[Math.min(removedIndex, newTabs.length - 1)].id
        } else {
          newActiveTabId = undefined
        }
      }

      return {
        ...group,
        activeTabId: newActiveTabId,
        tabs: newTabs,
      }
    }

    if (group.id === targetGroupId) {
      const insertIndex = targetIndex === undefined ? group.tabs.length : targetIndex
      const newTabs = [...group.tabs]
      newTabs.splice(insertIndex, 0, tabToMove)

      return {
        ...group,
        activeTabId: tabId,
        tabs: newTabs,
      }
    }

    return group
  })

  return {
    ...state,
    layout: {
      ...state.layout,
      activeGroupId: targetGroupId,
      groups: updatedGroups,
    },
  }
}
