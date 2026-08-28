import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { EditorGroup, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

const updateIcon = (state: MainAreaState, tabId: number, icon: string): MainAreaState => {
  return {
    ...state,
    layout: {
      ...state.layout,
      groups: state.layout.groups.map((group: EditorGroup) => ({
        ...group,
        tabs: group.tabs.map((tab: Tab) => (tab.id === tabId ? { ...tab, icon } : tab)),
      })),
    },
  }
}

export const updateTabIcon = async (
  context: AsyncCommandContext<MainAreaState>,
  readyState: MainAreaState,
  tabId: number,
): Promise<MainAreaState | undefined> => {
  const newTab = findTabById(readyState, tabId)
  if (!newTab || !newTab.tab.uri) {
    return undefined
  }

  const builtInIcon = PathDisplay.getFileIcon(newTab.tab.uri)
  if (builtInIcon) {
    return context.updateState((state) => updateIcon(state, tabId, builtInIcon))
  }

  try {
    const { newFileIconCache } = await getFileIconsForTabs([newTab.tab], readyState.fileIconCache)
    const stateBeforeIconUpdate = context.getState()
    const icon = newFileIconCache[newTab.tab.uri] || ''
    const stateWithIcon = updateIcon(
      {
        ...stateBeforeIconUpdate,
        fileIconCache: newFileIconCache,
      },
      tabId,
      icon,
    )
    return context.updateState(() => stateWithIcon)
  } catch {
    return undefined
  }
}
