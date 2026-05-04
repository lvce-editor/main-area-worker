import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SplitDirection } from '../MainAreaState/MainAreaState.ts'
import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import { getGroupSegments } from '../GetGroupSegments/GetGroupSegments.ts'
import * as Id from '../Id/Id.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

const rebalanceGroupSizes = <T extends { size: number }>(groups: readonly T[]): T[] => {
  const groupCount = groups.length
  if (groupCount === 0) {
    return []
  }
  const evenSize = Number((100 / groupCount).toFixed(6))
  const assignedSize = Number((evenSize * (groupCount - 1)).toFixed(6))
  const lastSize = Number((100 - assignedSize).toFixed(6))
  return groups.map((group, index) => ({
    ...group,
    size: index === groupCount - 1 ? lastSize : evenSize,
  }))
}

export const splitEditorGroup = (state: MainAreaState, groupId: number, direction: SplitDirection): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const sourceGroup = groups.find((group) => group.id === groupId)
  if (!sourceGroup) {
    return state
  }

  const newGroupId = Id.create()

  const isHorizontalSplit = direction === GroupDirection.Left || direction === GroupDirection.Right
  const splitLayoutDirection: LayoutDirection.LayoutDirection = isHorizontalSplit ? LayoutDirection.Horizontal : LayoutDirection.Vertical

  const baseNewGroup: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: newGroupId,
    isEmpty: true,
    size: sourceGroup.size / 2,
    tabs: [],
  }

  if (groups.length === 1) {
    const newLayoutDirection = splitLayoutDirection
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          direction: undefined,
          focused: false,
          size: 50,
        }
      }
      return group
    })
    const newGroup = {
      ...baseNewGroup,
      direction: undefined,
      size: 50,
    }
    const reorderedGroups = direction === GroupDirection.Right || direction === 'down' ? [...updatedGroups, newGroup] : [newGroup, ...updatedGroups]
    return {
      ...state,
      layout: {
        activeGroupId: newGroupId,
        direction: newLayoutDirection,
        groups: reorderedGroups,
      },
    }
  }

  if (sourceGroup.direction === splitLayoutDirection) {
    const sourceIndex = groups.findIndex((group) => group.id === groupId)
    const newGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          focused: false,
          size: Number((group.size / 2).toFixed(6)),
        }
      }
      return group
    })
    const newGroup = {
      ...baseNewGroup,
      direction: splitLayoutDirection,
      size: Number((sourceGroup.size / 2).toFixed(6)),
    }
    const insertIndex = direction === GroupDirection.Right || direction === 'down' ? sourceIndex + 1 : sourceIndex
    const reorderedGroups = [...newGroups.slice(0, insertIndex), newGroup, ...newGroups.slice(insertIndex)]
    return {
      ...state,
      layout: {
        activeGroupId: newGroupId,
        direction: layout.direction,
        groups: reorderedGroups,
      },
    }
  }

  if (splitLayoutDirection !== layout.direction && sourceGroup.direction === undefined) {
    const sourceIndex = groups.findIndex((group) => group.id === groupId)
    const halfSize = Number((sourceGroup.size / 2).toFixed(6))
    const updatedSourceGroup: EditorGroup = {
      ...sourceGroup,
      direction: splitLayoutDirection,
      focused: false,
      size: halfSize,
    }
    const newGroup: EditorGroup = {
      ...baseNewGroup,
      direction: splitLayoutDirection,
      size: Number((sourceGroup.size - halfSize).toFixed(6)),
    }
    const replacementGroups =
      direction === GroupDirection.Right || direction === 'down' ? [updatedSourceGroup, newGroup] : [newGroup, updatedSourceGroup]
    const reorderedGroups = [...groups.slice(0, sourceIndex), ...replacementGroups, ...groups.slice(sourceIndex + 1)]
    return {
      ...state,
      layout: {
        activeGroupId: newGroupId,
        direction: layout.direction,
        groups: reorderedGroups,
      },
    }
  }

  const segments = getGroupSegments(groups, layout.direction)
  const hasNestedSegments = segments.some((segment) => segment.direction !== undefined)
  if (splitLayoutDirection === layout.direction && !hasNestedSegments) {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          direction: undefined,
          focused: false,
          size: 50,
        }
      }
      return group
    })

    const newGroup = {
      ...baseNewGroup,
      direction: undefined,
      size: 50,
    }

    let reorderedGroups: typeof updatedGroups
    if (direction === GroupDirection.Right || direction === 'down') {
      reorderedGroups = [...updatedGroups, newGroup]
    } else {
      const sourceIndex = updatedGroups.findIndex((group) => group.id === groupId)
      reorderedGroups = [...updatedGroups.slice(0, sourceIndex), newGroup, ...updatedGroups.slice(sourceIndex)]
    }

    const resizedGroups = rebalanceGroupSizes(reorderedGroups)

    return {
      ...state,
      layout: {
        activeGroupId: newGroupId,
        direction: layout.direction,
        groups: resizedGroups,
      },
    }
  }

  return {
    ...state,
    layout: {
      activeGroupId: newGroupId,
      direction: layout.direction,
      groups,
    },
  }
}
