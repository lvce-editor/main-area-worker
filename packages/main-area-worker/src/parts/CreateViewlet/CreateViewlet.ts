import { RendererWorker } from '@lvce-editor/rpc-registry'

export const createViewlet = async (viewletModuleId: string, editorUid: number, tabId: number, bounds: any, uri: string): Promise<void> => {
  await RendererWorker.invoke('Layout.createViewlet', viewletModuleId, editorUid, tabId, bounds, uri)
}
