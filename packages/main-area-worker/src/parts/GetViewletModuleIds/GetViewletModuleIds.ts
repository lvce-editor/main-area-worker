import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import type { Tab } from '../Tab/Tab.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'

export const getViewletModuleIds = async (layout: MainAreaLayout): Promise<Record<string, string>> => {
  const viewletModuleIds: Record<string, string> = {}

  for (const group of layout.groups) {
    const { tabs } = group
    const activeTab = tabs.find((tab: Tab) => tab.id === group.activeTabId)
    if (activeTab && activeTab.uri) {
      const viewletModuleId = await getViewletModuleId(activeTab.uri)
      if (viewletModuleId) {
        viewletModuleIds[activeTab.id] = viewletModuleId
      }
    }
  }

  return viewletModuleIds
}
