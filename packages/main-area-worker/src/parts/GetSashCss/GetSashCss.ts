import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import * as SashId from '../SashId/SashId.ts'

export const getSashCss = (layout: MainAreaLayout): readonly string[] => {
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
    rules.push(`.Sash[data-sashId="${sashId}"] {
  ${sashPositionVariable}: ${sashOffset}%;
}`)
  }
  return rules
}
