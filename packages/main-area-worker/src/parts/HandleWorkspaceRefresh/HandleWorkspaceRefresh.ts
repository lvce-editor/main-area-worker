import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { WorkspaceChanges, WorkspaceRefresh } from '../WorkspaceChanges/WorkspaceChanges.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'
import { handleUriChange } from '../HandleUriChange/HandleUriChange.ts'

const getEditorInputUris = (editorInput: EditorInput | undefined): readonly string[] => {
  switch (editorInput?.type) {
    case 'diff-editor':
      return [editorInput.uriLeft, editorInput.uriRight]
    case 'editor':
    case 'image':
    case 'video':
    case 'webview':
      return [editorInput.uri]
    default:
      return []
  }
}

const getChangedEditorUid = (editorUid: number, editorInput: EditorInput | undefined, uri: string | undefined, changedUris: Set<string>) => {
  if (editorUid === -1) {
    return undefined
  }
  const uris = getEditorInputUris(editorInput)
  if (uris.some((editorUri) => changedUris.has(editorUri)) || (uris.length === 0 && uri && changedUris.has(uri))) {
    return editorUid
  }
  return undefined
}

const reloadChangedEditors = async (state: MainAreaState, changed: readonly string[]): Promise<void> => {
  if (changed.length === 0) {
    return
  }
  const changedUris = new Set(changed)
  const editorUids = new Set<number>()
  for (const group of state.layout.groups) {
    for (const tab of group.tabs) {
      const editorUid = getChangedEditorUid(tab.editorUid, tab.editorInput, tab.uri, changedUris)
      if (editorUid !== undefined) {
        editorUids.add(editorUid)
      }
    }
  }
  await Promise.allSettled(Array.from(editorUids, (editorUid) => RendererWorker.invoke('Viewlet.reload', editorUid)))
}

export const handleWorkspaceRefresh = async (state: MainAreaState, refresh: WorkspaceRefresh = {}): Promise<MainAreaState> => {
  const changes: WorkspaceChanges = Array.isArray(refresh) ? { deleted: refresh } : (refresh as WorkspaceChanges)
  const { changed = [], deleted = [], renamed = [] } = changes
  let newState = state
  for (const [oldUri, newUri] of renamed) {
    newState = await handleUriChange(newState, oldUri, newUri)
  }
  const deletedUris = new Set(deleted)
  for (const group of newState.layout.groups) {
    for (const tab of group.tabs) {
      if (tab.editorInput?.type === 'editor' && deletedUris.has(tab.editorInput.uri)) {
        newState = await closeTabWithViewlet(newState, group.id, tab.id)
      }
    }
  }
  await reloadChangedEditors(newState, changed)
  return newState
}

export const handleWorkspaceRefreshWithContext = async (
  context: AsyncCommandContext<MainAreaState>,
  refresh: WorkspaceRefresh = {},
): Promise<void> => {
  const state = context.getState()
  const newState = await handleWorkspaceRefresh(state, refresh)
  await context.updateState(() => newState)
}
