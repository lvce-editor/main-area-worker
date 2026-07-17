import type { Renderer } from '../Renderer/Renderer.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import { renderCss } from '../RenderCss/RenderCss.ts'
import { renderIncremental } from '../RenderIncremental/RenderIncremental.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'
import { renderPendingViewletDisposal } from '../RenderPendingViewletDisposal/RenderPendingViewletDisposal.ts'
import { renderPendingViewletFocus } from '../RenderPendingViewletFocus/RenderPendingViewletFocus.ts'

export const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderCss:
      return renderCss
    case DiffType.RenderIncremental:
      return renderIncremental
    case DiffType.RenderItems:
      return RenderItems.renderItems
    case DiffType.RenderPendingViewletDisposal:
      return renderPendingViewletDisposal
    case DiffType.RenderPendingViewletFocus:
      return renderPendingViewletFocus
    default:
      throw new Error('unknown renderer')
  }
}
