import type { DragOverlay, MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { getDragOverlayCss } from '../GetDragOverlayCss/GetDragOverlayCss.ts'
import { getEditorGroupCss } from '../GetEditorGroupCss/GetEditorGroupCss.ts'
import { getSashCorner } from '../GetSashCorner/GetSashCorner.ts'
import { getSashCss } from '../GetSashCss/GetSashCss.ts'

export const getCss = (layout?: MainAreaLayout, width: number = 0, dragOverlay?: DragOverlay): string => {
  const rules: string[] = []
  if (layout) {
    rules.push(...getEditorGroupCss(layout), ...getDragOverlayCss(dragOverlay), ...getSashCss(layout, width))
    const sashCorner = getSashCorner(layout)
    if (sashCorner) {
      rules.push(`.SashCorner {
  left: ${sashCorner.leftOffset}%;
  top: ${sashCorner.topOffset}%;
}`)
    }
  }
  const css = rules.join('\n')
  return css
}
