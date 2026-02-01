import { RendererWorker } from '@lvce-editor/rpc-registry'

export const saveEditor = async (editorUid: number): Promise<void> => {
  await RendererWorker.invoke('Editor.save', editorUid)
}
