import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'

export const copyRelativePath = async (state: MainAreaState, path: string): Promise<MainAreaState> => {
  Assert.string(path)
  const relativePath = await RendererWorker.invoke('Workspace.pathBaseName', path)
  await RendererWorker.invoke('ClipBoard.writeText', relativePath)
  return state
}
