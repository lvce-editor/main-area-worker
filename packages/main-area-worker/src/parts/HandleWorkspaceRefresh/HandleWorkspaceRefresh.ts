import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'

export const handleWorkspaceRefresh = async (state: MainAreaState, deletedUris: readonly string[] = []): Promise<MainAreaState> => {
  const deleted = new Set(deletedUris)
  let newState = state
  for (const group of state.layout.groups) {
    for (const tab of group.tabs) {
      if (tab.editorInput?.type === 'editor' && deleted.has(tab.editorInput.uri)) {
        newState = await closeTabWithViewlet(newState, group.id, tab.id)
      }
    }
  }
  return newState
}
