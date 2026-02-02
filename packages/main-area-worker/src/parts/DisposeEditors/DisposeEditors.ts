import { RendererWorker } from '@lvce-editor/rpc-registry'

export const disposeEditors = async (editorUids: readonly number[]): Promise<void> => {
  // Dispose all child viewlets in the renderer worker
  for (const editorUid of editorUids) {
    try {
      await RendererWorker.invoke('Viewlet.dispose', editorUid)
    } catch {
      // Silently ignore errors during disposal
      // Viewlet may already be disposed or renderer worker may not be available
    }
  }
}
