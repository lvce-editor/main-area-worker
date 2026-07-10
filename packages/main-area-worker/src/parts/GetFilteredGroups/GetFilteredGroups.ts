import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import { normalizeTabEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

const getSavedTab = (tab: EditorGroup['tabs'][number]): EditorGroup['tabs'][number] => {
  const normalizedTab = normalizeTabEditorInput(tab)
  const { errorMessage: _errorMessage, loadingState: _loadingState, ...rest } = normalizedTab
  return {
    ...rest,
    editorUid: -1,
  }
}

export const getFilteredGroups = (groups: readonly EditorGroup[]): readonly EditorGroup[] => {
  return groups.map((group) => {
    const tabs = group.tabs.filter((tab) => !tab.uri?.startsWith('untitled://')).map(getSavedTab)
    const activeTabId = tabs.some((tab) => tab.id === group.activeTabId) ? group.activeTabId : tabs[0]?.id
    return {
      ...group,
      activeTabId,
      isEmpty: tabs.length === 0,
      tabs,
    }
  })
}
