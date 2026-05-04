import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import { normalizeTabEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

export const getFilteredGroups = (groups: readonly EditorGroup[]): readonly EditorGroup[] => {
  return groups.map((group) => {
    const tabs = group.tabs.filter((tab) => !tab.uri?.startsWith('untitled://')).map(normalizeTabEditorInput)
    const activeTabId = tabs.some((tab) => tab.id === group.activeTabId) ? group.activeTabId : tabs[0]?.id
    return {
      ...group,
      activeTabId,
      isEmpty: tabs.length === 0,
      tabs,
    }
  })
}
