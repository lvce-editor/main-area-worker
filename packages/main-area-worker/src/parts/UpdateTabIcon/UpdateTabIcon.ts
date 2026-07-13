import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { EditorGroup, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'

export const updateTabIcon = async (
  context: AsyncCommandContext<MainAreaState>,
  readyState: MainAreaState,
  tabId: number,
): Promise<MainAreaState | undefined> => {
  const newTab = findTabById(readyState, tabId)
  if (!newTab || !newTab.tab.uri) {
    return undefined
  }

  try {
    const { newFileIconCache } = await getFileIconsForTabs([newTab.tab], readyState.fileIconCache)
    const stateBeforeIconUpdate = context.getState()
    const icon = newFileIconCache[newTab.tab.uri] || ''
    const stateWithIcon = {
      ...stateBeforeIconUpdate,
      fileIconCache: newFileIconCache,
      layout: {
        ...stateBeforeIconUpdate.layout,
        groups: stateBeforeIconUpdate.layout.groups.map((group: EditorGroup) => ({
          ...group,
          tabs: group.tabs.map((tab: Tab) => (tab.id === tabId ? { ...tab, icon } : tab)),
        })),
      },
    }
    return context.updateState(() => stateWithIcon)
  } catch {
    return undefined
  }
}
