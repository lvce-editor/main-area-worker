import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'
import { getAllTabs } from './GetAllTabs.ts'

export const loadFileIcons = async (state: MainAreaState): Promise<{ fileIconCache: FileIconCache; updatedLayout: any }> => {
  const { fileIconCache, layout } = state
  const { groups } = layout
  try {
    const allTabs = getAllTabs(layout)
    const { newFileIconCache } = await getFileIconsForTabs(allTabs, fileIconCache)

    // Update tabs with their icons
    const updatedLayout = {
      ...layout,
      groups: groups.map((group) => ({
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
      fileIconCache,
      updatedLayout: layout,
    }
  }
}
