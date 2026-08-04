import { getDragOverlayCss } from '../GetDragOverlayCss/GetDragOverlayCss.ts'
import { getEditorGroupCss } from '../GetEditorGroupCss/GetEditorGroupCss.ts'
import { getSashCorner } from '../GetSashCorner/GetSashCorner.ts'
import { getSashCss } from '../GetSashCss/GetSashCss.ts'
import type { DragOverlay, MainAreaLayout } from '../MainAreaState/MainAreaState.ts'

const getSashCornerCss = (left: number, top: number) => {
  return `.SashCorner {
  left: ${left}%;
  top: ${top}%;
}`
}

export const getCss = (layout?: MainAreaLayout, width: number = 0, dragOverlay?: DragOverlay): string => {
  const rules: string[] = []
  if (layout) {
    rules.push(...getEditorGroupCss(layout), ...getDragOverlayCss(dragOverlay), ...getSashCss(layout, width))
    const sashCorner = getSashCorner(layout)
    if (sashCorner) {
      rules.push(getSashCornerCss(sashCorner.leftOffset, sashCorner.topOffset))
    }
  }
  const css = rules.join('\n')
  return css
}
