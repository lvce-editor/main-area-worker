import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import { getFilteredGroups } from '../GetFilteredGroups/GetFilteredGroups.ts'

export const saveState = (state: MainAreaState): SavedState => {
  const { layout } = state
  const { groups } = layout

  const filteredGroups = getFilteredGroups(groups)

  // Update activeGroupId if it points to a removed group
  const { activeGroupId: originalActiveGroupId } = layout
  const activeGroupId = originalActiveGroupId !== -1 && filteredGroups.every((g) => g.id !== originalActiveGroupId) ? -1 : originalActiveGroupId

  return {
    layout: {
      ...layout,
      activeGroupId,
      groups: filteredGroups,
    },
  }
}
