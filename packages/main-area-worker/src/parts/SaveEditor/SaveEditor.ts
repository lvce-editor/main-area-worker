import { RendererWorker } from '@lvce-editor/rpc-registry'

export const saveEditor = async (editorUid: number): Promise<void> => {
  await RendererWorker.invoke('Editor.save', editorUid)
}

export interface EditorSaveState {
  readonly modified: boolean
}

export const getEditorSaveState = async (editorUid: number): Promise<EditorSaveState> => {
  return RendererWorker.invoke('Editor.saveState', editorUid)
}
