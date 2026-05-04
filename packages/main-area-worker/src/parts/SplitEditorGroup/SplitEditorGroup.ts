import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SplitDirection } from '../MainAreaState/MainAreaState.ts'
import { getGroupSegments } from '../GetGroupSegments/GetGroupSegments.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
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

const isTrailingSplit = (direction: SplitDirection): boolean => {
  return direction === GroupDirection.Right || direction === 'down'
}

const getSplitLayoutDirection = (direction: SplitDirection): LayoutDirection.LayoutDirection => {
  return direction === GroupDirection.Left || direction === GroupDirection.Right ? LayoutDirection.Horizontal : LayoutDirection.Vertical
}

const createNextState = (state: MainAreaState, activeGroupId: number, groups: readonly EditorGroup[]): MainAreaState => {
  return {
    ...state,
    layout: {
      activeGroupId,
      direction: state.layout.direction,
      groups,
    },
  }
}

const splitOnlyGroup = (
  state: MainAreaState,
  groups: readonly EditorGroup[],
  groupId: number,
  newGroupId: number,
  direction: SplitDirection,
  splitLayoutDirection: LayoutDirection.LayoutDirection,
  baseNewGroup: EditorGroup,
): MainAreaState => {
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
  const reorderedGroups = isTrailingSplit(direction) ? [...updatedGroups, newGroup] : [newGroup, ...updatedGroups]
  return {
    ...state,
    layout: {
      activeGroupId: newGroupId,
      direction: splitLayoutDirection,
      groups: reorderedGroups,
    },
  }
}

const splitWithinMatchingNestedDirection = (
  state: MainAreaState,
  groups: readonly EditorGroup[],
  sourceGroup: EditorGroup,
  groupId: number,
  newGroupId: number,
  direction: SplitDirection,
  splitLayoutDirection: LayoutDirection.LayoutDirection,
  baseNewGroup: EditorGroup,
): MainAreaState => {
  const sourceIndex = groups.findIndex((group) => group.id === groupId)
  const updatedGroups = groups.map((group) => {
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
  const insertIndex = isTrailingSplit(direction) ? sourceIndex + 1 : sourceIndex
  const reorderedGroups = [...updatedGroups.slice(0, insertIndex), newGroup, ...updatedGroups.slice(insertIndex)]
  return createNextState(state, newGroupId, reorderedGroups)
}

const splitStandaloneSourceIntoNestedDirection = (
  state: MainAreaState,
  groups: readonly EditorGroup[],
  sourceGroup: EditorGroup,
  groupId: number,
  newGroupId: number,
  direction: SplitDirection,
  splitLayoutDirection: LayoutDirection.LayoutDirection,
  baseNewGroup: EditorGroup,
): MainAreaState => {
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
  const replacementGroups = isTrailingSplit(direction) ? [updatedSourceGroup, newGroup] : [newGroup, updatedSourceGroup]
  const reorderedGroups = [...groups.slice(0, sourceIndex), ...replacementGroups, ...groups.slice(sourceIndex + 1)]
  return createNextState(state, newGroupId, reorderedGroups)
}

const splitAtRootLevel = (
  state: MainAreaState,
  groups: readonly EditorGroup[],
  groupId: number,
  newGroupId: number,
  direction: SplitDirection,
  baseNewGroup: EditorGroup,
): MainAreaState => {
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

  const reorderedGroups = isTrailingSplit(direction)
    ? [...updatedGroups, newGroup]
    : (() => {
        const sourceIndex = updatedGroups.findIndex((group) => group.id === groupId)
        return [...updatedGroups.slice(0, sourceIndex), newGroup, ...updatedGroups.slice(sourceIndex)]
      })()

  return createNextState(state, newGroupId, rebalanceGroupSizes(reorderedGroups))
}

export const splitEditorGroup = (state: MainAreaState, groupId: number, direction: SplitDirection): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const sourceGroup = groups.find((group) => group.id === groupId)
  if (!sourceGroup) {
    return state
  }

  const newGroupId = Id.create()

  const splitLayoutDirection = getSplitLayoutDirection(direction)

  const baseNewGroup: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: newGroupId,
    isEmpty: true,
    size: sourceGroup.size / 2,
    tabs: [],
  }

  if (groups.length === 1) {
    return splitOnlyGroup(state, groups, groupId, newGroupId, direction, splitLayoutDirection, baseNewGroup)
  }

  if (sourceGroup.direction === splitLayoutDirection) {
    return splitWithinMatchingNestedDirection(state, groups, sourceGroup, groupId, newGroupId, direction, splitLayoutDirection, baseNewGroup)
  }

  if (splitLayoutDirection !== layout.direction && sourceGroup.direction === undefined) {
    return splitStandaloneSourceIntoNestedDirection(state, groups, sourceGroup, groupId, newGroupId, direction, splitLayoutDirection, baseNewGroup)
  }

  const segments = getGroupSegments(groups, layout.direction)
  const hasNestedSegments = segments.some((segment) => segment.direction !== undefined)
  if (splitLayoutDirection === layout.direction && !hasNestedSegments) {
    return splitAtRootLevel(state, groups, groupId, newGroupId, direction, baseNewGroup)
  }

  return createNextState(state, newGroupId, groups)
}
