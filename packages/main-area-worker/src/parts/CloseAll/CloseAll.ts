import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getAllEditorUids } from '../GetAllEditorUids/GetAllEditorUids.ts'

export const closeAll = async (state: MainAreaState): Promise<MainAreaState> => {
  // Dispose all viewlets to prevent memory leaks
  const editorUids = getAllEditorUids(state)
  
  // Dispose all child viewlets in the renderer worker
  for (const editorUid of editorUids) {
    try {
      await RendererWorker.invoke('Viewlet.dispose', editorUid)
    } catch {
      // Silently ignore errors during disposal
      // Viewlet may already be disposed or renderer worker may not be available
    }
  }
  
  return {
    ...state,
    layout: {
      ...state.layout,
      activeGroupId: undefined,
      groups: [],
    },
  }
}
