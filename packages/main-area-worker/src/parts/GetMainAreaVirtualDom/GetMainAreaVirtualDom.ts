import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'
import { renderSash } from '../RenderSash/RenderSash.ts'
import { renderSingleEditorGroup } from '../RenderSingleEditorGroup/RenderSingleEditorGroup.ts'
import * as SashId from '../SashId/SashId.ts'

const MIN_GROUP_WIDTH_PX = 250

const getSashOffset = (layout: MainAreaLayout, groupIndex: number, width: number): string => {
  const { direction, groups } = layout
<<<<<<< HEAD
=======
  const percentOffset = groups.slice(0, groupIndex).reduce((total, group) => total + group.size, 0)

  if (direction !== LayoutDirection.Horizontal || !width || !Number.isFinite(width)) {
    return `${percentOffset}%`
  }

  const effectiveGroupSizes = groups.map((group) => Math.max((group.size / 100) * width, MIN_GROUP_WIDTH_PX))
  const hasOverflowingGroups = effectiveGroupSizes.some((size, index) => size !== (groups[index].size / 100) * width)

  if (!hasOverflowingGroups) {
    return `${percentOffset}%`
  }

  const pixelOffset = effectiveGroupSizes.slice(0, groupIndex).reduce((total, size) => total + size, 0)
  return `${pixelOffset}px`
}

export const getMainAreaVirtualDom = (layout: MainAreaLayout, splitButtonEnabled: boolean = false, width: number = 0): readonly VirtualDomNode[] => {
  const { direction, groups } = layout
  const sizeProperty = direction === LayoutDirection.Vertical ? 'height' : 'width'
>>>>>>> origin/main
  if (groups.length === 1) {
    return renderSingleEditorGroup(layout, splitButtonEnabled)
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
  let childCount = 0
  for (let i = 0; i < groups.length; i++) {
    if (i > 0) {
      // Insert sash between groups
      const beforeGroupId = groups[i - 1].id
      const afterGroupId = groups[i].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
<<<<<<< HEAD
      children.push(...renderSash(direction, sashId))
=======
      const offset = getSashOffset(layout, i, width)
      const style = direction === LayoutDirection.Horizontal ? `left:${offset};` : `top:${offset};`
      children.push(...renderSash(direction, sashId, style))
>>>>>>> origin/main
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
