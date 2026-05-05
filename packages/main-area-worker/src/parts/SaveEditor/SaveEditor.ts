import { RendererWorker } from '@lvce-editor/rpc-registry'

export interface EditorSaveState {
  readonly modified: boolean
}

export const saveEditor = async (editorUid: number): Promise<EditorSaveState | undefined> => {
  return RendererWorker.invoke('Editor.save', editorUid)
}
