import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { WorkspaceChanges, WorkspaceRefresh } from '../WorkspaceChanges/WorkspaceChanges.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'
import { handleUriChange } from '../HandleUriChange/HandleUriChange.ts'

export const handleWorkspaceRefresh = async (state: MainAreaState, refresh: WorkspaceRefresh = {}): Promise<MainAreaState> => {
  const changes: WorkspaceChanges = Array.isArray(refresh) ? { deleted: refresh } : (refresh as WorkspaceChanges)
  const { deleted = [], renamed = [] } = changes
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
