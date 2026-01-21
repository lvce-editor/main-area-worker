import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SplitDirection } from '../MainAreaState/MainAreaState.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import * as Id from '../Id/Id.ts'

export const splitEditorGroup = (state: MainAreaState, groupId: number, direction: SplitDirection): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const sourceGroup = groups.find((group) => group.id === groupId)
  if (!sourceGroup) {
    return state
  }

  const newGroupId = Id.create()

  const isHorizontalSplit = direction === GroupDirection.Left || direction === GroupDirection.Right
  const newLayoutDirection = isHorizontalSplit ? 'horizontal' : 'vertical'

  const updatedGroups = groups.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        focused: false,
        size: 50,
      }
    }
    return group
  })

  const newGroup = {
    activeTabId: undefined,
    focused: true,
    id: newGroupId,
    size: 50,
    tabs: [],
  }

  let reorderedGroups: typeof updatedGroups
  if (direction === GroupDirection.Right || direction === 'down') {
    reorderedGroups = [...updatedGroups, newGroup]
  } else {
    const sourceIndex = updatedGroups.findIndex((group) => group.id === groupId)
    reorderedGroups = [...updatedGroups.slice(0, sourceIndex), newGroup, ...updatedGroups.slice(sourceIndex)]
  }

  return {
    ...state,
    layout: {
      activeGroupId: newGroupId,
      direction: newLayoutDirection,
      groups: reorderedGroups,
    },
  }
}
