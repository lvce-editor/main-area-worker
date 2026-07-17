import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { handleUriChange } from '../HandleUriChange/HandleUriChange.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { WorkspaceChanges, WorkspaceRefresh } from '../WorkspaceChanges/WorkspaceChanges.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'

const normalizeWorkspaceChanges = (changes: WorkspaceRefresh): WorkspaceChanges => {
  if (Array.isArray(changes)) {
    return {
      deleted: changes,
    }
  }
  return changes as WorkspaceChanges
}

const isDeleted = (uri: string, deletedUris: readonly string[]): boolean => {
  return deletedUris.some((deletedUri) => uri === deletedUri || uri.startsWith(`${deletedUri}/`) || uri.startsWith(`${deletedUri}\\`))
}

export const handleWorkspaceRefresh = async (state: MainAreaState, refresh: WorkspaceRefresh = {}): Promise<MainAreaState> => {
  const { deleted = [], renamed = [] } = normalizeWorkspaceChanges(refresh)
  let newState = state
  for (const [oldUri, newUri] of renamed) {
    newState = await handleUriChange(newState, oldUri, newUri)
  }
  const tabsToClose: [groupId: number, tabId: number][] = []
  for (const group of newState.layout.groups) {
    for (const tab of group.tabs) {
      if (tab.editorInput?.type === 'editor' && isDeleted(tab.editorInput.uri, deleted)) {
        tabsToClose.push([group.id, tab.id])
      }
    }
  }
  for (const [groupId, tabId] of tabsToClose) {
    newState = await closeTabWithViewlet(newState, groupId, tabId)
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
