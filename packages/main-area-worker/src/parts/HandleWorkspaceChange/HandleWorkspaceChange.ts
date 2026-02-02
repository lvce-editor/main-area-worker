import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { disposeEditors } from '../DisposeEditors/DisposeEditors.ts'
import { getAllEditorUids } from '../GetAllEditorUids/GetAllEditorUids.ts'

export const handleWorkspaceChange = async (state: MainAreaState): Promise<MainAreaState> => {
  // Dispose all viewlets to prevent memory leaks
  const editorUids = getAllEditorUids(state)
  await disposeEditors(editorUids)
  
  return {
    ...state,
    layout: {
      ...state.layout,
      activeGroupId: undefined,
      groups: [],
    },
  }
}
