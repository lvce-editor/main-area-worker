import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import { loadHomeDirUri } from '../LoadHomeDirUri/LoadHomeDirUri.ts'
import { tryRestoreLayout } from '../TryRestoreLayout/TryRestoreLayout.ts'
import { updateTabUriTitles } from '../UpdateTabUriTitles/UpdateTabUriTitles.ts'
import { loadFileIcons } from './LoadFileIcons.ts'
import { restoreAndCreateEditors } from './RestoreAndCreateEditors.ts'

export const loadContent = async (state: MainAreaState, savedState: unknown): Promise<MainAreaState> => {
  const homeDirUri = await loadHomeDirUri()
  const stateWithHomeDir: MainAreaState = {
    ...state,
    homeDirUri,
  }
  const restoredLayout = tryRestoreLayout(savedState)
  if (restoredLayout) {
    // Restore and create editors
    const editorState = await restoreAndCreateEditors(stateWithHomeDir, restoredLayout)

    // Load file icons with the updated editor state
    const { fileIconCache, updatedLayout } = await loadFileIcons(editorState)

    // Merge the results
    const finalState = updateTabUriTitles({
      ...editorState,
      fileIconCache,
      initial: false,
      layout: updatedLayout,
    })

    return finalState
  }
  return {
    ...stateWithHomeDir,
    initial: false,
    layout: {
      activeGroupId: undefined,
      direction: LayoutDirection.Horizontal,
      groups: [],
    },
  }
}
