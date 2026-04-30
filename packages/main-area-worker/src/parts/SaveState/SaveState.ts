import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import { getFilteredGroups } from '../GetFilteredGroups/GetFilteredGroups.ts'

export const saveState = (state: MainAreaState): SavedState => {
  const { layout } = state

  const filteredGroups = getFilteredGroups(layout.groups)

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
