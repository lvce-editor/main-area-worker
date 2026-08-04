import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getViewletTitle = async (editorUid: number): Promise<string | undefined> => {
  try {
    const title = await RendererWorker.invoke('Viewlet.getTitle', editorUid)
    return typeof title === 'string' && title ? title : undefined
  } catch {
    return undefined
  }
}

export const createViewletContent = async (
  viewletModuleId: string,
  editorUid: number,
  tabId: number,
  bounds: any,
  uri: string,
  args?: readonly unknown[],
): Promise<void> => {
  if (args === undefined) {
    await RendererWorker.invoke('Layout.createViewlet', viewletModuleId, editorUid, tabId, bounds, uri)
  } else {
    await RendererWorker.invoke('Layout.createViewlet', viewletModuleId, editorUid, tabId, bounds, uri, args)
  }
}

export const createViewlet = async (
  viewletModuleId: string,
  editorUid: number,
  tabId: number,
  bounds: any,
  uri: string,
  args?: readonly unknown[],
): Promise<string | undefined> => {
  await createViewletContent(viewletModuleId, editorUid, tabId, bounds, uri, args)
  return getViewletTitle(editorUid)
}
