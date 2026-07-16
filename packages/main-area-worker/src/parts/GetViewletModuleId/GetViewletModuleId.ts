import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getViewletModuleId = async (uri: string, opener?: string): Promise<string | undefined> => {
  // Query RendererWorker for viewlet module ID (optional, may fail in tests)
  let viewletModuleId: string | undefined
  try {
    viewletModuleId =
      opener === undefined ? await RendererWorker.invoke('Layout.getModuleId', uri) : await RendererWorker.invoke('Layout.getModuleId', uri, opener)
  } catch {
    // Viewlet creation is optional - silently ignore if RendererWorker isn't available
  }
  return viewletModuleId
}
