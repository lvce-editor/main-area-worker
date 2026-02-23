import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'
import { renderSash } from '../RenderSash/RenderSash.ts'
import { renderSingleEditorGroup } from '../RenderSingleEditorGroup/RenderSingleEditorGroup.ts'
import * as SashId from '../SashId/SashId.ts'

export const getMainAreaVirtualDom = (layout: MainAreaLayout, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  const { direction, groups } = layout
  const sizeProperty = direction === 'vertical' ? 'height' : 'width'
  if (groups.length === 1) {
    return renderSingleEditorGroup(layout, splitButtonEnabled, sizeProperty)
  }

  const children = []
  const isSplit = groups.length > 1
  const directionClassName = isSplit ? (direction === 'horizontal' ? ClassNames.EditorGroupsVertical : ClassNames.EditorGroupsHorizontal) : ''
  const editorGroupsContainerClassName = directionClassName
    ? `${ClassNames.EDITOR_GROUPS_CONTAINER} ${directionClassName}`
    : ClassNames.EDITOR_GROUPS_CONTAINER
  let sashOffset = 0
<<<<<<< HEAD
  let editorGroupsContainerChildCount = 0
  for (let i = 0; i < layout.groups.length; i++) {
    sashOffset += layout.groups[i].size
=======
  let childCount = 0
  for (let i = 0; i < groups.length; i++) {
    sashOffset += groups[i].size
>>>>>>> origin/main
    if (i > 0) {
      // Insert sash between groups
      const beforeGroupId = groups[i - 1].id
      const afterGroupId = groups[i].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
<<<<<<< HEAD
      const style = layout.direction === 'horizontal' ? `left:${sashOffset - layout.groups[i].size}%;` : `top:${sashOffset - layout.groups[i].size}%;`
      children.push(...renderSash(layout.direction, sashId, style))
      editorGroupsContainerChildCount++
    }
    const editorGroupDom = renderEditorGroup(layout.groups[i], i, splitButtonEnabled, sizeProperty)
    children.push(...editorGroupDom)
    editorGroupsContainerChildCount++
=======
      const style = direction === 'horizontal' ? `left:${sashOffset - groups[i].size}%;` : `top:${sashOffset - groups[i].size}%;`
      children.push(...renderSash(direction, sashId, style))
      childCount++
    }
    children.push(...renderEditorGroup(groups[i], i, splitButtonEnabled, sizeProperty))
    childCount++
>>>>>>> origin/main
  }
  return [
    {
      childCount: 1,
      className: ClassNames.Main,
      type: VirtualDomElements.Div,
    },
    {
<<<<<<< HEAD
      childCount: editorGroupsContainerChildCount,
=======
      childCount,
>>>>>>> origin/main
      className: editorGroupsContainerClassName,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
}
