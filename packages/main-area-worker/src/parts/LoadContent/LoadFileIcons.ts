import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'
import { getAllTabs } from './GetAllTabs.ts'

export const loadFileIcons = async (state: MainAreaState): Promise<{ fileIconCache: FileIconCache; updatedLayout: any }> => {
  try {
    const allTabs = getAllTabs(state.layout)
    const { newFileIconCache } = await getFileIconsForTabs(allTabs, state.fileIconCache)

    // Update tabs with their icons
    const updatedLayout = {
      ...state.layout,
      groups: state.layout.groups.map((group) => ({
        ...group,
        tabs: group.tabs.map((tab) => ({
          ...tab,
          icon: newFileIconCache[tab.uri || ''],
        })),
      })),
    }

    return {
      fileIconCache: newFileIconCache,
      updatedLayout,
    }
  } catch {
    // If icon request fails, continue without icons
    return {
      fileIconCache: state.fileIconCache,
      updatedLayout: state.layout,
    }
  }
}
