import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getSashOffset } from '../GetSashOffset/GetSashOffset.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'
import { renderSash } from '../RenderSash/RenderSash.ts'
import { renderSingleEditorGroup } from '../RenderSingleEditorGroup/RenderSingleEditorGroup.ts'
import * as SashId from '../SashId/SashId.ts'

export const getMainAreaVirtualDom = (layout: MainAreaLayout, splitButtonEnabled: boolean = false, width: number = 0): readonly VirtualDomNode[] => {
  const { direction, groups } = layout
  const sizeProperty = direction === LayoutDirection.Vertical ? 'height' : 'width'
  if (groups.length === 1) {
    return renderSingleEditorGroup(layout, splitButtonEnabled, sizeProperty)
  }

  const children = []
  const isSplit = groups.length > 1
  const directionClassName = isSplit
    ? direction === LayoutDirection.Horizontal
      ? ClassNames.EditorGroupsVertical
      : ClassNames.EditorGroupsHorizontal
    : ''
  const editorGroupsContainerClassName = directionClassName
    ? `${ClassNames.EDITOR_GROUPS_CONTAINER} ${directionClassName}`
    : ClassNames.EDITOR_GROUPS_CONTAINER
  if (groups.length === 0) {
    return [
      {
        childCount: 1,
        className: ClassNames.Main,
        type: VirtualDomElements.Div,
      },
      {
        childCount: 0,
        className: editorGroupsContainerClassName,
        'data-groupId': '',
        onContextMenu: DomEventListenerFunctions.HandleContextMenu,
        role: AriaRoles.None,
        type: VirtualDomElements.Div,
      },
    ]
  }
  let childCount = 0
  for (let i = 0; i < groups.length; i++) {
    if (i > 0) {
      // Insert sash between groups
      const beforeGroupId = groups[i - 1].id
      const afterGroupId = groups[i].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
      const offset = getSashOffset(layout, i, width)
      const style = direction === LayoutDirection.Horizontal ? `left:${offset};` : `top:${offset};`
      children.push(...renderSash(direction, sashId, style))
      childCount++
    }
    const editorGroupDom = renderEditorGroup(groups[i], i, splitButtonEnabled, sizeProperty)
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
