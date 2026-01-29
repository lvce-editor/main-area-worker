import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'

export const splitDown = (state: MainAreaState, groupId: number): MainAreaState => {
  return SplitEditorGroup.splitEditorGroup(state, groupId, 'down')
}
