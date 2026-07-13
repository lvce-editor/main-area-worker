import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

export const handleWorkspaceChange = async (state: MainAreaState, _workspacePath?: string, savedState?: unknown): Promise<MainAreaState> => {
  return LoadContent.loadContent(state, savedState)
}
