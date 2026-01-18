import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SplitDirection } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'

export const splitEditorGroup = (state: MainAreaState, groupId: number, direction: SplitDirection): MainAreaState => {
  const sourceGroup = state.layout.groups.find((group) => group.id === groupId)
  if (!sourceGroup) {
    return state
  }

  const newGroupId = Id.create()

  const isHorizontalSplit = direction === 'left' || direction === 'right'
  const newLayoutDirection = isHorizontalSplit ? 'horizontal' : 'vertical'

  const updatedGroups = state.layout.groups.map((group) => {
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
  if (direction === 'right' || direction === 'down') {
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
