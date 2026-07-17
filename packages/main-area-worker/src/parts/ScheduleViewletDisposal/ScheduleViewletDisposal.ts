import { RendererWorker } from '@lvce-editor/rpc-registry'

export const scheduleViewletDisposal = (editorUid: number): void => {
  setTimeout(() => {
    void RendererWorker.invoke('Viewlet.dispose', editorUid).catch(() => {})
  }, 50)
}
