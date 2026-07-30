import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import { getEditorGroupClassName } from '../GetEditorGroupClassName/GetEditorGroupClassName.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

export const getEditorGroupCss = (layout: MainAreaLayout): readonly string[] => {
  const groupSizeVariable = layout.direction === LayoutDirection.Vertical ? '--EditorGroupHeight' : '--EditorGroupWidth'
  return layout.groups.map((group) => {
    return `.${getEditorGroupClassName(group.id)} {
  ${groupSizeVariable}: ${group.size}%;
}`
  })
}
