import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: MainAreaState): SavedState => {
  const { layout } = state

  // Filter out untitled editors from tabs
  const filteredGroups = layout.groups
    .map((group) => ({
      ...group,
      tabs: group.tabs.filter((tab) => !tab.uri?.startsWith('untitled://')),
    }))
    // Remove groups that become empty after filtering
    .filter((group) => group.tabs.length > 0)

  // Update activeGroupId if it points to a removed group
  const { activeGroupId: originalActiveGroupId } = layout
  const activeGroupId =
    originalActiveGroupId !== undefined && !filteredGroups.some((g) => g.id === originalActiveGroupId) ? undefined : originalActiveGroupId

  return {
    layout: {
      ...layout,
      activeGroupId,
      groups: filteredGroups,
    },
  }
}
