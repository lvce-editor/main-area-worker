import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../Tab/Tab.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import * as Id from '../Id/Id.ts'
import { getSelectedTabBounds } from '../SelectTab/GetSelectedTabBounds/GetSelectedTabBounds.ts'

interface CreatedViewlets {
  readonly editorUids: Record<string, number>
  readonly titles: Record<string, string>
}

export const createViewlets = async (state: MainAreaState, viewletModuleIds: Record<string, string>): Promise<CreatedViewlets> => {
  const { layout } = state
  const { groups } = layout
  const editorUids: Record<string, number> = {}
  const titles: Record<string, string> = {}

  for (const group of groups) {
    const activeTab = group.tabs.find((tab: Tab) => tab.id === group.activeTabId)
    if (activeTab && viewletModuleIds[activeTab.id]) {
      const editorUid = activeTab.editorUid === -1 ? Id.create() : activeTab.editorUid
      editorUids[activeTab.id] = editorUid

      const bounds = getSelectedTabBounds(state, group.id)
      const title = await createViewlet(
        viewletModuleIds[activeTab.id],
        editorUid,
        activeTab.id,
        bounds,
        activeTab.uri || '',
        undefined,
        state.applicationId,
      )
      if (title) {
        titles[activeTab.id] = title
      }
    }
  }

  return { editorUids, titles }
}
