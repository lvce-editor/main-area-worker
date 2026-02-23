import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { withEmptyGroups } from '../WithEmptyGroups/WithEmptyGroups.ts'

export const closeAll = (state: MainAreaState): MainAreaState => {
  return withEmptyGroups(state)
}
