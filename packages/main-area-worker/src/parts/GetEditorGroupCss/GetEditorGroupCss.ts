import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import { getEditorGroupClassName } from '../GetEditorGroupClassName/GetEditorGroupClassName.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

export const getEditorGroupCss = (layout: MainAreaLayout): readonly string[] => {
  const { direction, groups } = layout
  const groupSizeVariable = direction === LayoutDirection.Vertical ? '--EditorGroupHeight' : '--EditorGroupWidth'
  return groups.map((group) => {
    return `.${getEditorGroupClassName(group.id)} {
  ${groupSizeVariable}: ${group.size}%;
}`
  })
}
