import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getFileIconsForTabs } from '../GetFileIcons/GetFileIcons.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { getAllTabs } from './GetAllTabs.ts'

const updateLayoutIcons = (layout: MainAreaState['layout'], fileIconCache: FileIconCache, preserveExisting: boolean): MainAreaState['layout'] => {
  const { groups } = layout
  return {
    ...layout,
    groups: groups.map((group) => ({
      ...group,
      tabs: group.tabs.map((tab) => {
        const { icon: existingIcon } = tab
        const uri = tab.uri || ''
        const builtInIcon = PathDisplay.getFileIcon(uri)
        let icon = fileIconCache[uri]
        if (preserveExisting && !(uri in fileIconCache)) {
          icon = existingIcon
        }
        if (builtInIcon) {
          icon = builtInIcon
        }
        return {
          ...tab,
          icon,
        }
      }),
    })),
  }
}

export const loadFileIcons = async (state: MainAreaState): Promise<{ fileIconCache: FileIconCache; updatedLayout: any }> => {
  const { fileIconCache, layout } = state
  try {
    const allTabs = getAllTabs(layout)
    const { newFileIconCache } = await getFileIconsForTabs(allTabs, fileIconCache)

    return {
      fileIconCache: newFileIconCache,
      updatedLayout: updateLayoutIcons(layout, newFileIconCache, false),
    }
  } catch {
    return {
      fileIconCache,
      updatedLayout: updateLayoutIcons(layout, fileIconCache, true),
    }
  }
}
