import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'

export const copyPath = async (state: MainAreaState, path: string): Promise<MainAreaState> => {
  Assert.string(path)
  await RendererWorker.invoke('ClipBoard.writeText', path)
  return state
}
