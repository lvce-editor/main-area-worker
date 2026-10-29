import { RendererWorker } from '@lvce-editor/rpc-registry'
import { registry } from '../MainAreaRegistry/MainAreaRegistry.ts'

const deferred = new Set<number>()

export const flushDeferredDisposals = async (): Promise<void> => {
  await disposeEditors([...deferred])
}

export const disposeEditors = async (editorUids: readonly number[]): Promise<void> => {
  // Dispose all child viewlets in the renderer worker
  for (const editorUid of editorUids) {
    const retained = registry
      .getKeys()
      .some((uid) => registry.get(uid).newState.layout.groups.some((group) => group.paintHold?.tab.editorUid === editorUid))
    if (retained) {
      deferred.add(editorUid)
      continue
    }
    deferred.delete(editorUid)
    try {
      await RendererWorker.invoke('Viewlet.dispose', editorUid)
    } catch {
      // Silently ignore errors during disposal
      // Viewlet may already be disposed or renderer worker may not be available
    }
  }
}
