import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { newFile } from '../NewFile/NewFile.ts'

export const handleHeaderDoubleClick = async (state: MainAreaState, groupIndexRaw: string): Promise<MainAreaState> => {
  if (!groupIndexRaw) {
    return state
  }

  return newFile(state)
}
