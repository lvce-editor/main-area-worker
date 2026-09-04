import type { MainAreaState, TabDropIndicator } from '../MainAreaState/MainAreaState.ts'
import { getEditorGroupBounds } from '../GetEditorGroupBounds/GetEditorGroupBounds.ts'
import { handleEditorDragOver } from '../HandleEditorDragOver/HandleEditorDragOver.ts'

const hasDraggedTab = (state: MainAreaState): boolean => {
  const { pointerDownGroupIndex, pointerDownTabIndex } = state
  return Boolean(state.layout.groups[pointerDownGroupIndex]?.tabs[pointerDownTabIndex])
}

const withTabDropIndicator = (state: MainAreaState, tabDropIndicator: TabDropIndicator): MainAreaState => {
  const oldIndicator = state.tabDropIndicator
  if (!state.dragOverlay && oldIndicator?.groupId === tabDropIndicator.groupId && oldIndicator.index === tabDropIndicator.index) {
    return state
  }
  return {
    ...state,
    dragOverlay: undefined,
    tabDropIndicator,
  }
}

export const handleTabDragOver = (
  state: MainAreaState,
  groupIndexRaw: string,
  tabIndexRaw: string,
  tabOffsetLeft: number,
  tabWidth: number,
  tabsScrollLeft: number,
  clientX: number,
  clientY: number,
): MainAreaState => {
  if (!hasDraggedTab(state)) {
    return handleEditorDragOver(state, clientX, clientY)
  }
  const groupIndex = Number.parseInt(groupIndexRaw)
  const tabIndex = Number.parseInt(tabIndexRaw)
  const group = state.layout.groups[groupIndex]
  if (!group || tabIndex < 0 || tabIndex >= group.tabs.length) {
    return state
  }
  const groupBounds = getEditorGroupBounds(state.layout, state.width, state.height)[groupIndex]
  const tabMidpoint = state.x + groupBounds.x + tabOffsetLeft - tabsScrollLeft + tabWidth / 2
  const index = clientX < tabMidpoint ? tabIndex : tabIndex + 1
  return withTabDropIndicator(state, { groupId: group.id, index })
}

export const handleTabsDragOver = (state: MainAreaState, groupIndexRaw: string, clientX: number, clientY: number): MainAreaState => {
  if (!hasDraggedTab(state)) {
    return handleEditorDragOver(state, clientX, clientY)
  }
  const groupIndex = Number.parseInt(groupIndexRaw)
  const group = state.layout.groups[groupIndex]
  if (!group) {
    return state
  }
  return withTabDropIndicator(state, { groupId: group.id, index: group.tabs.length })
}
