import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { withGroupsAndActiveGroup } from '../WithGroupsAndActiveGroup/WithGroupsAndActiveGroup.ts'

export const withEmptyGroups = (state: MainAreaState): MainAreaState => {
  return withGroupsAndActiveGroup(state, [], undefined)
}
