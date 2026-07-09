import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const newWindow = async (state: MainAreaState): Promise<MainAreaState> => {
  await RendererWorker.invoke('ElectronWindow.openNew')
  return state
}
