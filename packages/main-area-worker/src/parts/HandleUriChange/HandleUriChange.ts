import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { loadFileIcons } from '../LoadContent/LoadFileIcons.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { getUriTitle } from '../UpdateTabUriTitles/UpdateTabUriTitles.ts'

export const handleUriChange = async (state: MainAreaState, oldUri: string, newUri: string): Promise<MainAreaState> => {
  const { layout } = state
  const { groups } = layout
  const editorUriUpdates: Promise<unknown>[] = []
  const updatedGroups = groups.map((group) => {
    return {
      ...group,
      tabs: group.tabs.map((tab) => {
        const uri = tab.uri || ''
        let renamedUri = ''
        if (uri === oldUri) {
          renamedUri = newUri
        } else if (uri.startsWith(`${oldUri}/`) || uri.startsWith(`${oldUri}\\`)) {
          renamedUri = `${newUri}${uri.slice(oldUri.length)}`
        }
        if (renamedUri) {
          if (tab.editorType === 'text' && tab.editorUid !== -1) {
            editorUriUpdates.push(RendererWorker.invoke('Editor.handleUriChange', tab.editorUid, renamedUri))
          }
          const editorInput =
            tab.editorInput && 'uri' in tab.editorInput
              ? {
                  ...tab.editorInput,
                  uri: renamedUri,
                }
              : tab.editorInput
          return {
            ...tab,
            editorInput,
            title: PathDisplay.getLabel(renamedUri),
            uri: renamedUri,
            uriTitle: getUriTitle(renamedUri, state.homeDirUri || ''),
          }
        }
        return tab
      }),
    }
  })
  await Promise.all(editorUriUpdates)
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
