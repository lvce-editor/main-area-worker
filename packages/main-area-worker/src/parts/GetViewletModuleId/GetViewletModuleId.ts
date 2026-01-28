import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getViewletModuleId = async (uri: string): Promise<string | undefined> => {
  // Query RendererWorker for viewlet module ID (optional, may fail in tests)
  let viewletModuleId: string | undefined
  try {
    // @ts-ignore
    viewletModuleId = await RendererWorker.invoke('Layout.getModuleId', uri)
  } catch {
    // Viewlet creation is optional - silently ignore if RendererWorker isn't available
  }
  return viewletModuleId
}
