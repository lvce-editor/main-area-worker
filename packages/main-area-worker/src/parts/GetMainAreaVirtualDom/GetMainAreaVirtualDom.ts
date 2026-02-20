import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'
import { renderSash } from '../RenderSash/RenderSash.ts'
import * as SashId from '../SashId/SashId.ts'

export const getMainAreaVirtualDom = (layout: MainAreaLayout, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  const sizeProperty = layout.direction === 'vertical' ? 'height' : 'width'
  if (layout.groups.length === 1) {
    return [
      {
        childCount: 1,
        className: ClassNames.Main,
        type: VirtualDomElements.Div,
      },
      ...renderEditorGroup(layout.groups[0], 0, splitButtonEnabled, sizeProperty),
    ]
  }

  const children = []
  const isSplit = layout.groups.length > 1
  const directionClassName = isSplit ? (layout.direction === 'horizontal' ? ClassNames.EditorGroupsVertical : ClassNames.EditorGroupsHorizontal) : ''
  const editorGroupsContainerClassName = directionClassName
    ? `${ClassNames.EDITOR_GROUPS_CONTAINER} ${directionClassName}`
    : ClassNames.EDITOR_GROUPS_CONTAINER
  let sashOffset = 0
  for (let i = 0; i < layout.groups.length; i++) {
    sashOffset += layout.groups[i].size
    if (i > 0) {
      // Insert sash between groups
      const beforeGroupId = layout.groups[i - 1].id
      const afterGroupId = layout.groups[i].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
      const style = layout.direction === 'horizontal' ? `left:${sashOffset - layout.groups[i].size}%;` : `top:${sashOffset - layout.groups[i].size}%;`
      children.push(renderSash(layout.direction, sashId, style))
    }
    children.push(...renderEditorGroup(layout.groups[i], i, splitButtonEnabled, sizeProperty))
  }
  return [
    {
      childCount: 1,
      className: ClassNames.Main,
      type: VirtualDomElements.Div,
    },
    {
      childCount: children.length,
      className: editorGroupsContainerClassName,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
}
