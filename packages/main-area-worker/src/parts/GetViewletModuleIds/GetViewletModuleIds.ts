import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import type { Tab } from '../Tab/Tab.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { normalizeTabEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

export const getViewletModuleIds = async (layout: MainAreaLayout, applicationId?: string, restoreAll = false): Promise<Record<string, string>> => {
  const { groups } = layout
  const viewletModuleIds: Record<string, string> = {}

  for (const group of groups) {
    const { tabs } = group
    const selectedTabs = tabs.filter((tab: Tab) => (restoreAll || tab.id === group.activeTabId) && (tab.editorInput || tab.uri))
    for (const activeTab of selectedTabs) {
      const normalizedTab = normalizeTabEditorInput(activeTab)
      const { editorInput, uri } = normalizedTab
      const viewletModuleId = normalizedTab.editorInput
        ? await getViewletModuleIdForEditorInput(editorInput, applicationId)
        : await getViewletModuleId(uri, undefined, applicationId)
      if (viewletModuleId) {
        viewletModuleIds[activeTab.id] = viewletModuleId
      }
    }
  }

  return viewletModuleIds
}
