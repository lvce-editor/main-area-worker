import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const isTabActive = (state: MainAreaState, tabId: number): boolean => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  const activeGroup = groups.find((group) => group.id === activeGroupId)
  if (!activeGroup) {
    return false
  }

  return activeGroup.activeTabId === tabId
}
