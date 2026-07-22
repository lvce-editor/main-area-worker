import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { getEditorGroupCss } from '../GetEditorGroupCss/GetEditorGroupCss.ts'
import { getSashCorner } from '../GetSashCorner/GetSashCorner.ts'
import { getSashCss } from '../GetSashCss/GetSashCss.ts'

export const getCss = (layout?: MainAreaLayout, width: number = 0): string => {
  const rules = [
    `.MainArea {
}`,
    `.editor-groups-container {
  overflow: auto;
}`,

    `.SashBorder {
  background: var(--SashBorder, gray);
}`,

    `.SashBorderHorizontal {
  width: 100%;
  height: 1px;
}`,

    `.SashBorderVertical {
  width: 1px;
  height: 100%;
}`,

    `.SashCorner {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: all-scroll;
  transform: translate(-50%, -50%);
}`,

    `.SashCorner::after {
  content: '';
  width: 4px;
  height: 4px;
  background: var(--SashBorder, gray);
}`,

    `.SashCorner:hover::after,
.SashCorner:active::after {
  background: var(--SashHoverBorder, #3d5252);
}`,

    `.EditorGroup {
  min-width: 250px;
  width: var(--EditorGroupWidth, auto);
  /*height: var(--EditorGroupHeight, auto);*/
}`,
  ]
  if (layout) {
    rules.push(...getEditorGroupCss(layout), ...getSashCss(layout, width))
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
