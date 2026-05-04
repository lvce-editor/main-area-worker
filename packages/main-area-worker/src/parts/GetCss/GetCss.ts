import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { getEditorGroupCss } from '../GetEditorGroupCss/GetEditorGroupCss.ts'
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

    `.EditorGroup {
  min-width: 250px;
  width: var(--EditorGroupWidth, auto);
  /*height: var(--EditorGroupHeight, auto);*/
}`,
  ]
  if (layout) {
    rules.push(...getEditorGroupCss(layout), ...getSashCss(layout, width))
  }
  const css = rules.join('\n')
  return css
}
