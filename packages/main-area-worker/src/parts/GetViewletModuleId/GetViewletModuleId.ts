import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

export const getViewletModuleId = async (uri: string, opener?: string, applicationId?: string): Promise<string | undefined> => {
  // Query RendererWorker for viewlet module ID (optional, may fail in tests)
  let viewletModuleId: string | undefined
  try {
    viewletModuleId =
      opener === undefined
        ? await ApplicationRpc.invoke(applicationId, 'Layout.getModuleId', uri)
        : await ApplicationRpc.invoke(applicationId, 'Layout.getModuleId', uri, opener)
  } catch {
    // Viewlet creation is optional - silently ignore if RendererWorker isn't available
  }
  return viewletModuleId
}
