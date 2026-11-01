import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { handleResize } from '../HandleResize/HandleResize.ts'

type Split = (state: MainAreaState, ...args: any[]) => MainAreaState

export const splitEditorGroupAndResize = async (state: MainAreaState, split: Split, ...args: any[]): Promise<MainAreaState> => {
  const newState = split(state, ...args)
  if (newState === state) {
    return state
  }
  await handleResize(newState, newState)
  const editorUids = newState.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.editorUid).filter((editorUid) => editorUid !== -1))
  for (const editorUid of editorUids) {
    await RendererWorker.invoke('Viewlet.requestRender', editorUid)
  }
  return newState
}
