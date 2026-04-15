import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'
import { renderSash } from '../RenderSash/RenderSash.ts'
import { renderSingleEditorGroup } from '../RenderSingleEditorGroup/RenderSingleEditorGroup.ts'
import * as SashId from '../SashId/SashId.ts'

export const getMainAreaVirtualDom = (layout: MainAreaLayout, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  const { direction, groups } = layout
  if (groups.length === 1) {
    return renderSingleEditorGroup(layout, splitButtonEnabled)
  }

  const children = []
  const isSplit = groups.length > 1
  const directionClassName = isSplit ? (direction === 'horizontal' ? ClassNames.EditorGroupsVertical : ClassNames.EditorGroupsHorizontal) : ''
  const editorGroupsContainerClassName = directionClassName
    ? `${ClassNames.EDITOR_GROUPS_CONTAINER} ${directionClassName}`
    : ClassNames.EDITOR_GROUPS_CONTAINER
  let childCount = 0
  for (let i = 0; i < groups.length; i++) {
    if (i > 0) {
      // Insert sash between groups
      const beforeGroupId = groups[i - 1].id
      const afterGroupId = groups[i].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
      children.push(...renderSash(direction, sashId))
      childCount++
    }
    const editorGroupDom = renderEditorGroup(groups[i], i, splitButtonEnabled)
    children.push(...editorGroupDom)
    childCount++
  }
  return [
    {
      childCount: 1,
      className: ClassNames.Main,
      type: VirtualDomElements.Div,
    },
    {
      childCount,
      className: editorGroupsContainerClassName,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
}
