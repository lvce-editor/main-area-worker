import { RendererWorker } from '@lvce-editor/rpc-registry'

export interface EditorSaveState {
  readonly modified: boolean
}

export const saveEditor = async (editorUid: number, skipFormatting = false): Promise<EditorSaveState | undefined> => {
  if (skipFormatting) {
    return RendererWorker.invoke('Editor.save', editorUid, true)
  }
  return RendererWorker.invoke('Editor.save', editorUid)
}
