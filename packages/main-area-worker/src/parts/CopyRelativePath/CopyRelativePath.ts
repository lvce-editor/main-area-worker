import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as Assert from '../Assert/Assert.ts'

export const copyRelativePath = async (state: MainAreaState, path: string): Promise<MainAreaState> => {
  Assert.string(path)
  const relativePath = await ApplicationRpc.invoke(state.applicationId, 'Workspace.pathBaseName', path)
  await ClipBoardWorker.writeText(relativePath)
  return state
}
