import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { loadFileIcons } from '../LoadContent/LoadFileIcons.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { getUriTitle } from '../UpdateTabUriTitles/UpdateTabUriTitles.ts'

export const handleUriChange = async (state: MainAreaState, oldUri: string, newUri: string): Promise<MainAreaState> => {
  const { layout } = state
  const { groups } = layout
  const newTitle = PathDisplay.getLabel(newUri)
  const editorUriUpdates: Promise<unknown>[] = []
  for (const group of groups) {
    for (const tab of group.tabs) {
      if (tab.uri === oldUri && tab.editorType === 'text' && tab.editorUid !== -1) {
        editorUriUpdates.push(RendererWorker.invoke('Editor.handleUriChange', tab.editorUid, newUri))
      }
    }
  }
  await Promise.all(editorUriUpdates)
  const updatedGroups = groups.map((group) => {
    return {
      ...group,
      tabs: group.tabs.map((tab) => {
        if (tab.uri === oldUri) {
          return {
            ...tab,
            title: newTitle,
            uri: newUri,
            uriTitle: getUriTitle(newUri, state.homeDirUri || ''),
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
