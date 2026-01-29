import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getMaxIdFromLayout } from '../GetMaxIdFromLayout/GetMaxIdFromLayout.ts'
import * as Id from '../Id/Id.ts'
import { tryRestoreLayout } from '../TryRestoreLayout/TryRestoreLayout.ts'
import { loadFileIcons } from './LoadFileIcons.ts'
import { restoreAndCreateEditors } from './RestoreAndCreateEditors.ts'

export const loadContent = async (state: MainAreaState, savedState: unknown): Promise<MainAreaState> => {
  const restoredLayout = tryRestoreLayout(savedState)
  if (restoredLayout) {
    const maxId = getMaxIdFromLayout(restoredLayout)
    Id.setMinId(maxId)

    // Restore and create editors
    const editorState = await restoreAndCreateEditors(state, restoredLayout)

    // Load file icons with the updated editor state
    const { fileIconCache, updatedLayout } = await loadFileIcons(editorState)

    // Merge the results
    const finalState: MainAreaState = {
      ...editorState,
      fileIconCache,
      layout: updatedLayout,
    }

    return finalState
  }
  return {
    ...state,
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }
}
