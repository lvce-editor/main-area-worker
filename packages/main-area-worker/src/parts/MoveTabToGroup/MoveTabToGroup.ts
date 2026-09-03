import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const moveTabToGroup = (
  state: MainAreaState,
  sourceGroupId: number,
  targetGroupId: number,
  tabId: number,
  targetIndex?: number,
): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const sourceGroup = groups.find((group) => group.id === sourceGroupId)
  const hasTargetGroup = groups.some((group) => group.id === targetGroupId)

  if (!sourceGroup || !hasTargetGroup) {
    return state
  }

  const tabToMove = sourceGroup.tabs.find((tab) => tab.id === tabId)
  if (!tabToMove) {
    return state
  }

  if (sourceGroupId === targetGroupId) {
    if (targetIndex === undefined) {
      return state
    }
    const sourceIndex = sourceGroup.tabs.findIndex((tab) => tab.id === tabId)
    const insertionBoundary = Math.min(Math.max(targetIndex, 0), sourceGroup.tabs.length)
    const insertionIndex = insertionBoundary > sourceIndex ? insertionBoundary - 1 : insertionBoundary
    if (insertionIndex === sourceIndex) {
      return state
    }
    const tabs = sourceGroup.tabs.filter((tab) => tab.id !== tabId)
    tabs.splice(insertionIndex, 0, tabToMove)
    return {
      ...state,
      layout: {
        ...layout,
        activeGroupId: targetGroupId,
        groups: groups.map((group) => (group.id === targetGroupId ? { ...group, tabs } : group)),
      },
    }
  }

  const updatedGroups = groups.map((group) => {
    if (group.id === sourceGroupId) {
      const newTabs = group.tabs.filter((tab) => tab.id !== tabId)
      let newActiveTabId = group.activeTabId

      if (group.activeTabId === tabId) {
        if (newTabs.length > 0) {
          const removedIndex = group.tabs.findIndex((tab) => tab.id === tabId)
          newActiveTabId = newTabs[Math.min(removedIndex, newTabs.length - 1)].id
        } else {
          newActiveTabId = -1
        }
      }

      return {
        ...group,
        activeTabId: newActiveTabId,
        isEmpty: newTabs.length === 0,
        tabs: newTabs,
      }
    }

    if (group.id === targetGroupId) {
      const insertIndex = targetIndex === undefined ? group.tabs.length : Math.min(Math.max(targetIndex, 0), group.tabs.length)
      const newTabs = [...group.tabs]
      newTabs.splice(insertIndex, 0, tabToMove)

      return {
        ...group,
        activeTabId: tabId,
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
      activeGroupId: targetGroupId,
      groups: updatedGroups,
    },
  }
}
