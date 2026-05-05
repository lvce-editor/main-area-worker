import { RendererWorker } from '@lvce-editor/rpc-registry'
import { normalizeViewletModuleId } from '../NormalizeViewletModuleId/NormalizeViewletModuleId.ts'

export const createViewlet = async (viewletModuleId: string, editorUid: number, tabId: number, bounds: any, uri: string): Promise<void> => {
  const normalizedViewletModuleId = normalizeViewletModuleId(viewletModuleId)
  await RendererWorker.invoke('Layout.createViewlet', normalizedViewletModuleId, editorUid, tabId, bounds, uri)
}
