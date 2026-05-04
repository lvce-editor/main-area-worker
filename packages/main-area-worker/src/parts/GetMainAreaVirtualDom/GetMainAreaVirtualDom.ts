import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { LayoutDirection as LayoutDirectionType } from '../LayoutDirection/LayoutDirection.ts'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'
import { renderSash } from '../RenderSash/RenderSash.ts'
import { renderSingleEditorGroup } from '../RenderSingleEditorGroup/RenderSingleEditorGroup.ts'
import * as SashId from '../SashId/SashId.ts'

const getDirectionClassName = (direction: number, isSplit: boolean): string => {
  if (!isSplit) {
    return ''
  }
  return direction === LayoutDirection.Horizontal ? ClassNames.EditorGroupsVertical : ClassNames.EditorGroupsHorizontal
}

const getContainerClassName = (direction: LayoutDirectionType, childCount: number): string => {
  const directionClassName = getDirectionClassName(direction, childCount > 1)
  return directionClassName ? `${ClassNames.EDITOR_GROUPS_CONTAINER} ${directionClassName}` : ClassNames.EDITOR_GROUPS_CONTAINER
}

const getSizeProperty = (direction: LayoutDirectionType): 'width' | 'height' => {
  return direction === LayoutDirection.Vertical ? 'height' : 'width'
}

const renderSegmentChildren = (
  direction: LayoutDirectionType,
  groups: MainAreaLayout['groups'],
  splitButtonEnabled: boolean,
): { childCount: number; children: VirtualDomNode[] } => {
  const segments = getGroupSegments(groups, direction)
  const children: VirtualDomNode[] = []
  let childCount = 0
  const sizeProperty = getSizeProperty(direction)
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (i > 0) {
      const previousSegment = segments[i - 1]
      const beforeGroupId = previousSegment.groups.at(-1)?.id || 0
      const afterGroupId = segment.groups[0].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
      children.push(...renderSash(direction, sashId))
      childCount++
    }
    if (segment.direction === undefined) {
      children.push(...renderEditorGroup(segment.groups[0], segment.startIndex, splitButtonEnabled, sizeProperty))
      childCount++
      continue
    }
    const nestedDirection = segment.direction
    const nestedSizeProperty = getSizeProperty(nestedDirection)
    const nestedChildCount = segment.groups.length + segment.groups.length - 1
    const nestedChildren: VirtualDomNode[] = []
    let nestedCount = 0
    const segmentSize = getSegmentSize(segment)
    for (let j = 0; j < segment.groups.length; j++) {
      if (j > 0) {
        const beforeGroupId = segment.groups[j - 1].id
        const afterGroupId = segment.groups[j].id
        const sashId = SashId.create(beforeGroupId, afterGroupId)
        nestedChildren.push(...renderSash(nestedDirection, sashId))
        nestedCount++
      }
      const group = segment.groups[j]
      const normalizedSize = Number(((group.size / segmentSize) * 100).toFixed(6))
      nestedChildren.push(
        ...renderEditorGroup(
          {
            ...group,
            size: normalizedSize,
          },
          segment.startIndex + j,
          splitButtonEnabled,
          nestedSizeProperty,
        ),
      )
      nestedCount++
    }
    children.push({
      childCount: nestedChildCount,
      className: getContainerClassName(nestedDirection, segment.groups.length),
      role: AriaRoles.None,
      style: `${sizeProperty}:${segmentSize}%;`,
      type: VirtualDomElements.Div,
    })
    children.push(...nestedChildren)
    childCount++
    childCount += nestedCount
  }
  return { childCount, children }
}

export const getMainAreaVirtualDom = (layout: MainAreaLayout, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  const { direction, groups } = layout
  const sizeProperty = getSizeProperty(direction)
  if (groups.length === 1) {
    return renderSingleEditorGroup(layout, splitButtonEnabled, sizeProperty)
  }

  const editorGroupsContainerClassName = getContainerClassName(direction, groups.length)
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
  const { childCount, children } = renderSegmentChildren(direction, groups, splitButtonEnabled)
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
