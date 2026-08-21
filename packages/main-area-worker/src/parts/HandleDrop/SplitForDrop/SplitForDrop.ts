import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../../EditorSplitDirection/EditorSplitDirection.ts'
import { splitDown } from '../../SplitDown/SplitDown.ts'
import { splitLeft } from '../../SplitLeft/SplitLeft.ts'
import { splitRight } from '../../SplitRight/SplitRight.ts'
import { splitUp } from '../../SplitUp/SplitUp.ts'

export const splitForDrop = (state: MainAreaState, splitDirection: number, targetGroupId?: number): MainAreaState => {
  switch (splitDirection) {
    case EditorSplitDirection.Down:
      return splitDown(state, targetGroupId)
    case EditorSplitDirection.Left:
      return splitLeft(state, targetGroupId)
    case EditorSplitDirection.Right:
      return splitRight(state, targetGroupId)
    case EditorSplitDirection.Up:
      return splitUp(state, targetGroupId)
    default:
      return state
  }
}
