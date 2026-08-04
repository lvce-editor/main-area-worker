import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

export const handleWorkspaceChange = async (state: MainAreaState, _workspacePath?: string, savedState?: unknown): Promise<MainAreaState> => {
  const newState = await LoadContent.loadContent(state, savedState)
  return {
    ...newState,
    closedTabs: [],
  }
}
