import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import { normalizeTabEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

export const getFilteredGroups = (groups: readonly EditorGroup[]): readonly EditorGroup[] => {
  return groups
    .map((group) => ({
      ...group,
      tabs: group.tabs.filter((tab) => !tab.uri?.startsWith('untitled://')).map(normalizeTabEditorInput),
    }))
    .filter((group) => group.tabs.length > 0)
}
