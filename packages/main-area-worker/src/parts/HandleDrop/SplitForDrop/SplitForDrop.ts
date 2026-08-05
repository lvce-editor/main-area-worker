import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../../EditorSplitDirection/EditorSplitDirection.ts'
import { splitDown } from '../../SplitDown/SplitDown.ts'
import { splitLeft } from '../../SplitLeft/SplitLeft.ts'
import { splitRight } from '../../SplitRight/SplitRight.ts'
import { splitUp } from '../../SplitUp/SplitUp.ts'

export const splitForDrop = (state: MainAreaState, splitDirection: number): MainAreaState => {
  switch (splitDirection) {
    case EditorSplitDirection.Down:
      return splitDown(state)
    case EditorSplitDirection.Left:
      return splitLeft(state)
    case EditorSplitDirection.Right:
      return splitRight(state)
    case EditorSplitDirection.Up:
      return splitUp(state)
    default:
      return state
  }
}
