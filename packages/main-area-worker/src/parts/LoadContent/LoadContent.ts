import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { tryRestoreLayout } from '../TryRestoreLayout/TryRestoreLayout.ts'
import { loadFileIcons } from './LoadFileIcons.ts'
import { restoreAndCreateEditors } from './RestoreAndCreateEditors.ts'

export const loadContent = async (state: MainAreaState, savedState: unknown): Promise<MainAreaState> => {
  const restoredLayout = tryRestoreLayout(savedState)
  if (restoredLayout) {
    // Restore and create editors
    const editorState = await restoreAndCreateEditors(state, restoredLayout)

    // Load file icons with the updated editor state
    const { fileIconCache, updatedLayout } = await loadFileIcons(editorState)

    // Merge the results
    const finalState: MainAreaState = {
      ...editorState,
      fileIconCache,
      initial: false,
      layout: updatedLayout,
    }

    return finalState
  }
  return {
    ...state,
    initial: false,
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }
}
