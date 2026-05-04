import type { EditorGroup, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'

export const updateTabIcon = async (
  uid: number,
  state: MainAreaState,
  readyState: MainAreaState,
  tabId: number,
): Promise<MainAreaState | undefined> => {
  const newTab = findTabById(readyState, tabId)
  if (!newTab || !newTab.tab.uri) {
    return undefined
  }

  try {
    const { newFileIconCache } = await getFileIconsForTabs([newTab.tab], readyState.fileIconCache)
    const { newState: stateBeforeIconUpdate } = get(uid)
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
    set(uid, state, stateWithIcon)
    return stateWithIcon
  } catch {
    return undefined
  }
}
