import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { newFile } from '../NewFile/NewFile.ts'

export const handleHeaderDoubleClick = async (state: MainAreaState, className: string, groupIndexRaw: string): Promise<MainAreaState> => {
  if (className !== ClassNames.MainTabs) {
    return state
  }
  return newFile(state)
}
