import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import type { LayoutDirection } from '../LayoutDirection/LayoutDirection.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'
import * as LayoutDirectionType from '../LayoutDirection/LayoutDirection.ts'

export interface LayoutSlot {
  readonly direction?: LayoutDirection
  readonly size: number
}

const flipDirection = (direction: LayoutDirection): LayoutDirection => {
  return direction === LayoutDirectionType.Horizontal ? LayoutDirectionType.Vertical : LayoutDirectionType.Horizontal
}

const createEmptyGroup = (): EditorGroup => {
  return {
    activeTabId: undefined,
    focused: false,
    id: Id.create(),
    isEmpty: true,
    size: 100,
    tabs: [],
  }
}

const getActiveGroupIndex = (groups: readonly EditorGroup[], activeGroupId: number | undefined): number => {
  const activeIndex = groups.findIndex((group) => group.id === activeGroupId)
  if (activeIndex !== -1) {
    return activeIndex
  }
  const focusedIndex = groups.findIndex((group) => group.focused)
  if (focusedIndex !== -1) {
    return focusedIndex
  }
  return 0
}

const mergeGroups = (target: EditorGroup, groups: readonly EditorGroup[], activeGroupId: number | undefined): EditorGroup => {
  const allGroups = [target, ...groups]
  const tabs = allGroups.flatMap((group) => group.tabs)
  const activeGroup = allGroups.find((group) => group.id === activeGroupId) ?? groups.findLast((group) => group.activeTabId !== undefined) ?? target
  const activeTabId = activeGroup.activeTabId ?? tabs[0]?.id
  return {
    ...target,
    activeTabId,
    isEmpty: tabs.length === 0,
    tabs,
  }
}

const getGroupsForSlotCount = (groups: readonly EditorGroup[], slotCount: number, activeGroupId: number | undefined): readonly EditorGroup[] => {
  if (slotCount === 1) {
    const firstGroup = groups[0] ?? createEmptyGroup()
    return [mergeGroups(firstGroup, groups.slice(1), activeGroupId)]
  }
  if (groups.length === slotCount) {
    return groups
  }
  if (groups.length < slotCount) {
    const missingGroups = Array.from({ length: slotCount - groups.length }, createEmptyGroup)
    return [...groups, ...missingGroups]
  }
  const retainedGroups = groups.slice(0, slotCount)
  const extraGroups = groups.slice(slotCount)
  const lastGroup = retainedGroups.at(-1)
  if (!lastGroup) {
    return retainedGroups
  }
  return [...retainedGroups.slice(0, -1), mergeGroups(lastGroup, extraGroups, activeGroupId)]
}

export const setEditorLayout = (state: MainAreaState, direction: LayoutDirection, slots: readonly LayoutSlot[]): MainAreaState => {
  const { layout } = state
  const groups = getGroupsForSlotCount(layout.groups, slots.length, layout.activeGroupId)
  const originalActiveIndex = layout.groups.findIndex((group) => group.id === layout.activeGroupId)
  const activeIndex = originalActiveIndex >= slots.length ? slots.length - 1 : getActiveGroupIndex(groups, layout.activeGroupId)
  const nextGroups = groups.map((group, index) => {
    const slot = slots[index]
    const focused = index === activeIndex
    return {
      ...group,
      direction: slot.direction,
      focused,
      size: slot.size,
    }
  })
  return {
    ...state,
    layout: {
      activeGroupId: nextGroups[activeIndex]?.id,
      direction,
      groups: nextGroups,
    },
  }
}

export const flipLayout = (state: MainAreaState): MainAreaState => {
  return {
    ...state,
    layout: {
      ...state.layout,
      direction: flipDirection(state.layout.direction),
      groups: state.layout.groups.map((group) => ({
        ...group,
        direction: group.direction === undefined ? undefined : flipDirection(group.direction),
      })),
    },
  }
}

export const setEditorLayoutSingle = (state: MainAreaState): MainAreaState => {
  return setEditorLayout(state, LayoutDirectionType.Horizontal, [{ size: 100 }])
}

export const setEditorLayoutTwoColumns = (state: MainAreaState): MainAreaState => {
  return setEditorLayout(state, LayoutDirectionType.Horizontal, [{ size: 50 }, { size: 50 }])
}

export const setEditorLayoutThreeColumns = (state: MainAreaState): MainAreaState => {
  return setEditorLayout(state, LayoutDirectionType.Horizontal, [{ size: 33.333333 }, { size: 33.333333 }, { size: 33.333334 }])
}

export const setEditorLayoutTwoRows = (state: MainAreaState): MainAreaState => {
  return setEditorLayout(state, LayoutDirectionType.Vertical, [{ size: 50 }, { size: 50 }])
}

export const setEditorLayoutThreeRows = (state: MainAreaState): MainAreaState => {
  return setEditorLayout(state, LayoutDirectionType.Vertical, [{ size: 33.333333 }, { size: 33.333333 }, { size: 33.333334 }])
}

export const setEditorLayoutGrid = (state: MainAreaState): MainAreaState => {
  return setEditorLayout(state, LayoutDirectionType.Horizontal, [
    { direction: LayoutDirectionType.Vertical, size: 25 },
    { direction: LayoutDirectionType.Vertical, size: 25 },
    { direction: LayoutDirectionType.Vertical, size: 25 },
    { direction: LayoutDirectionType.Vertical, size: 25 },
  ])
}

export const setEditorLayoutTwoRowsRight = (state: MainAreaState): MainAreaState => {
  return setEditorLayout(state, LayoutDirectionType.Horizontal, [
    { size: 50 },
    { direction: LayoutDirectionType.Vertical, size: 25 },
    { direction: LayoutDirectionType.Vertical, size: 25 },
  ])
}

export const setEditorLayoutTwoColumnsBottom = (state: MainAreaState): MainAreaState => {
  return setEditorLayout(state, LayoutDirectionType.Vertical, [
    { size: 50 },
    { direction: LayoutDirectionType.Horizontal, size: 25 },
    { direction: LayoutDirectionType.Horizontal, size: 25 },
  ])
}
