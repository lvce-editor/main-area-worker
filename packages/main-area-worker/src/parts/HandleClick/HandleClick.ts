import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleClick = async (state: MainAreaState, name: string): Promise<MainAreaState> => {
  if (!name) {
    return state
  }
  return state
}
