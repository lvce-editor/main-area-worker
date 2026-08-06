import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as DiffCss from '../DiffCss/DiffCss.ts'
import * as DiffDragData from '../DiffDragData/DiffDragData.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'
import * as DiffType from '../DiffType/DiffType.ts'

const isPendingViewletUpdateEqual = (oldState: MainAreaState, newState: MainAreaState): boolean => {
  return newState.pendingViewletUpdate === undefined
}

export const modules = [DiffItems.isEqual, DiffCss.isEqual, isPendingViewletUpdateEqual, DiffDragData.isEqual]

export const numbers = [DiffType.RenderIncremental, DiffType.RenderCss, DiffType.RenderPendingViewletUpdate, DiffType.RenderDragData]
