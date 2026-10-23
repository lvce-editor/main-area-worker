import { get, RendererWorker, RpcId } from '@lvce-editor/rpc-registry'

export interface EditorSaveState {
  readonly modified: boolean
}

const legacyRenderers = new WeakSet<object>()

export const saveEditor = async (editorUid: number, skipFormatting = false): Promise<EditorSaveState | undefined> => {
  const args = skipFormatting ? [editorUid, true] : [editorUid]
  const rpc = get(RpcId.RendererWorker)
  if (legacyRenderers.has(rpc)) {
    return RendererWorker.invoke('Editor.save', ...args)
  }
  try {
    return await RendererWorker.invoke('Viewlet.save', ...args)
  } catch (error) {
    // Older renderers support only text editors. Never retry an actual save failure.
    if (
      !(error instanceof Error) ||
      !['Command not found Viewlet.save', 'Command "Viewlet.save" not found (renderer worker)'].includes(error.message)
    ) {
      throw error
    }
    legacyRenderers.add(rpc)
    return RendererWorker.invoke('Editor.save', ...args)
  }
}
