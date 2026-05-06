import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import type { Tab } from '../Tab/Tab.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { normalizeTabEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

export const getViewletModuleIds = async (layout: MainAreaLayout): Promise<Record<string, string>> => {
  const viewletModuleIds: Record<string, string> = {}

  for (const group of layout.groups) {
    const { tabs } = group
    const activeTab = tabs.find((tab: Tab) => tab.id === group.activeTabId)
    if (activeTab && (activeTab.editorInput || activeTab.uri)) {
      const normalizedTab = normalizeTabEditorInput(activeTab)
      const viewletModuleId = normalizedTab.editorInput
        ? await getViewletModuleIdForEditorInput(normalizedTab.editorInput)
        : await getViewletModuleId(normalizedTab.uri!)
      if (viewletModuleId) {
        viewletModuleIds[activeTab.id] = viewletModuleId
      }
    }
  }

  return viewletModuleIds
}
