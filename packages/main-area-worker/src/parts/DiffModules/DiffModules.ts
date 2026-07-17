import * as DiffCss from '../DiffCss/DiffCss.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'
import * as DiffPendingViewletDisposal from '../DiffPendingViewletDisposal/DiffPendingViewletDisposal.ts'
import * as DiffPendingViewletFocus from '../DiffPendingViewletFocus/DiffPendingViewletFocus.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const modules = [DiffItems.isEqual, DiffCss.isEqual, DiffPendingViewletDisposal.isEqual, DiffPendingViewletFocus.isEqual]

export const numbers = [DiffType.RenderIncremental, DiffType.RenderCss, DiffType.RenderPendingViewletDisposal, DiffType.RenderPendingViewletFocus]
