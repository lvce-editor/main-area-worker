import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

const getFilteredGroups = (groups: MainAreaState['layout']['groups']): MainAreaState['layout']['groups'] => {
  return groups
    .map((group) => ({
      ...group,
      tabs: group.tabs.filter((tab) => !tab.uri?.startsWith('untitled://')),
    }))
    .filter((group) => group.tabs.length > 0)
}

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
