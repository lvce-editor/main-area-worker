import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getDirtyTabs } from '../GetDirtyTabs/GetDirtyTabs.ts'

export const hasDirtyTabs = (state: MainAreaState): boolean => {
  return getDirtyTabs(state).length > 0
}
