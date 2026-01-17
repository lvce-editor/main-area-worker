import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const loadContent = async (state: MainAreaState): Promise<MainAreaState> => {
  return {
    ...state,
  }
}
