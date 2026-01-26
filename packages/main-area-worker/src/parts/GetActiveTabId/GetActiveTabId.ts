import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getActiveTabId = (state: MainAreaState): number | undefined => {
  const { layout } = state
  const { activeGroupId, groups } = layout
  const activeGroup = groups.find((g) => g.id === activeGroupId)
  return activeGroup?.activeTabId
}
