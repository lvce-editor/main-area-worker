import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { loadFileIcons } from '../LoadContent/LoadFileIcons.ts'

export const handleIconThemeChange = async (state: MainAreaState): Promise<MainAreaState> => {
  const stateWithEmptyIconCache: MainAreaState = {
    ...state,
    fileIconCache: {},
  }
  const { fileIconCache, updatedLayout } = await loadFileIcons(stateWithEmptyIconCache)
  return {
    ...state,
    iconThemeVersion: (state.iconThemeVersion ?? 0) + 1,
    fileIconCache,
    layout: updatedLayout,
  }
}
