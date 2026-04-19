import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import * as SashId from '../SashId/SashId.ts'

const getEditorGroupCss = (layout: MainAreaLayout): readonly string[] => {
  const groupSizeVariable = layout.direction === LayoutDirection.Vertical ? '--EditorGroupHeight' : '--EditorGroupWidth'
  return layout.groups.map((group) => {
    return `.EditorGroup[data-group-id="${group.id}"] {
  ${groupSizeVariable}: ${group.size}%;
}`
  })
}

const getSashCss = (layout: MainAreaLayout): readonly string[] => {
  if (layout.groups.length <= 1) {
    return []
  }
  const sashPositionVariable = layout.direction === LayoutDirection.Horizontal ? '--SashLeft' : '--SashTop'
  const rules: string[] = []
  let sashOffset = 0
  for (let i = 1; i < layout.groups.length; i++) {
    sashOffset += layout.groups[i - 1].size
    const beforeGroupId = layout.groups[i - 1].id
    const afterGroupId = layout.groups[i].id
    const sashId = SashId.create(beforeGroupId, afterGroupId)
    rules.push(`.Sash[data-sash-id="${sashId}"] {
  ${sashPositionVariable}: ${sashOffset}%;
}`)
  }
  return rules
}

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
  height: var(--EditorGroupHeight, auto);
}`,
    `.SashVertical {
  left: var(--SashLeft);
}`,
    `.SashHorizontal {
  top: var(--SashTop);
}`,
  ]
  if (layout) {
    rules.push(...getEditorGroupCss(layout), ...getSashCss(layout))
  }
  const css = rules.join('\n')
  return css
}
