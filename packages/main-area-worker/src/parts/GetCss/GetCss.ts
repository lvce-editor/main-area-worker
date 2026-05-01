import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { getEditorGroupCss } from '../GetEditorGroupCss/GetEditorGroupCss.ts'
import { getSashCss } from '../GetSashCss/GetSashCss.ts'

export const getCss = (layout?: MainAreaLayout): string => {
  const rules = [
    `.MainArea {
}`,
    `.editor-groups-container {
  overflow: auto;
}`,

    `.EditorGroup {
  min-width: 250px;
  width: var(--EditorGroupWidth, auto);
  /*height: var(--EditorGroupHeight, auto);*/
}`,
    `.MainArea .SashVertical {
  left: var(--SashLeft);
}`,
    `.MainArea .SashHorizontal {
  top: var(--SashTop);
}`,
  ]
  if (layout) {
    rules.push(...getEditorGroupCss(layout), ...getSashCss(layout))
  }
  const css = rules.join('\n')
  return css
}
