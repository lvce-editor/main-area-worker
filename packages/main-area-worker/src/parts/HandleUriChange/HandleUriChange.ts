import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorInput } from '../EditorInput/EditorInput.ts'
import { getRenamedUri } from '../GetRenamedUri/GetRenamedUri.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { loadFileIcons } from '../LoadContent/LoadFileIcons.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { getUriTitle } from '../UpdateTabUriTitles/UpdateTabUriTitles.ts'

const updateEditorInputUri = (editorInput: EditorInput | undefined, oldUri: string, newUri: string): EditorInput | undefined => {
  if (!editorInput || !('uri' in editorInput)) {
    return editorInput
  }
  const uri = getRenamedUri(editorInput.uri, oldUri, newUri)
  if (uri === editorInput.uri) {
    return editorInput
  }
  return {
    ...editorInput,
    uri,
  }
}

export const handleUriChange = async (state: MainAreaState, oldUri: string, newUri: string): Promise<MainAreaState> => {
  const { layout } = state
  const { groups } = layout
  const editorUriUpdates: Promise<unknown>[] = []
  for (const group of groups) {
    for (const tab of group.tabs) {
      const renamedUri = tab.uri && getRenamedUri(tab.uri, oldUri, newUri)
      if (renamedUri && renamedUri !== tab.uri && tab.editorType === 'text' && tab.editorUid !== -1) {
        editorUriUpdates.push(RendererWorker.invoke('Editor.handleUriChange', tab.editorUid, renamedUri))
      }
    }
  }
  await Promise.all(editorUriUpdates)
  const updatedGroups = groups.map((group) => {
    return {
      ...group,
      tabs: group.tabs.map((tab) => {
        const renamedUri = tab.uri && getRenamedUri(tab.uri, oldUri, newUri)
        if (renamedUri && renamedUri !== tab.uri) {
          return {
            ...tab,
            editorInput: updateEditorInputUri(tab.editorInput, oldUri, newUri),
            title: PathDisplay.getLabel(renamedUri),
            uri: renamedUri,
            uriTitle: getUriTitle(renamedUri, state.homeDirUri || ''),
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
