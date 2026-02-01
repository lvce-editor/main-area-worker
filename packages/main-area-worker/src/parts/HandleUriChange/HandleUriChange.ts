import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { loadFileIcons } from '../LoadContent/LoadFileIcons.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

export const handleUriChange = async (state: MainAreaState, oldUri: string, newUri: string): Promise<MainAreaState> => {
  const { layout } = state
  const { groups } = layout
  const newTitle = PathDisplay.getLabel(newUri)
  const updatedGroups = groups.map((group) => {
    return {
      ...group,
      tabs: group.tabs.map((tab) => {
        if (tab.uri === oldUri) {
          return {
            ...tab,
            title: newTitle,
            uri: newUri,
          }
        }
        return tab
      }),
    }
  })
  const stateWithUpdatedUri: MainAreaState = {
    ...state,
    layout: {
      ...layout,
      groups: updatedGroups,
    },
  }

  // Load icons for the new URI
  const result = await loadFileIcons(stateWithUpdatedUri)

  return {
    ...stateWithUpdatedUri,
    fileIconCache: result.fileIconCache,
    layout: result.updatedLayout,
  }
}
