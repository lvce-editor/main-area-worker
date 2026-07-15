import { RendererWorker } from '@lvce-editor/rpc-registry'

const getTitle = async (editorUid: number): Promise<string | undefined> => {
  try {
    const title = await RendererWorker.invoke('Viewlet.getTitle', editorUid)
    return typeof title === 'string' && title ? title : undefined
  } catch {
    return undefined
  }
}

export const createViewlet = async (
  viewletModuleId: string,
  editorUid: number,
  tabId: number,
  bounds: any,
  uri: string,
): Promise<string | undefined> => {
  await RendererWorker.invoke('Layout.createViewlet', viewletModuleId, editorUid, tabId, bounds, uri)
  return getTitle(editorUid)
}
