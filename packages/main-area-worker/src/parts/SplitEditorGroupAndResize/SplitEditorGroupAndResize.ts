import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { handleResize } from '../HandleResize/HandleResize.ts'

type Split = (state: MainAreaState, ...args: any[]) => MainAreaState

export const splitEditorGroupAndResize = async (state: MainAreaState, split: Split, ...args: any[]): Promise<MainAreaState> => {
  const newState = split(state, ...args)
  if (newState === state) {
    return state
  }
  const resizeCommands = await handleResize(newState, newState)
  if (resizeCommands.length > 0) {
    await RendererWorker.invoke('Viewlet.sendMultiple', resizeCommands)
  }
  return newState
}
