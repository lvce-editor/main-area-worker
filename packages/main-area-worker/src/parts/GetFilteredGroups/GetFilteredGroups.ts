import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'

export const getFilteredGroups = (groups: readonly EditorGroup[]): readonly EditorGroup[] => {
  return groups
    .map((group) => ({
      ...group,
      tabs: group.tabs.filter((tab) => !tab.uri?.startsWith('untitled://')),
    }))
    .filter((group) => group.tabs.length > 0)
}
