import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { handleEditorDragOver } from '../HandleEditorDragOver/HandleEditorDragOver.ts'
import { handleTabDragOver } from '../HandleTabDragOver/HandleTabDragOver.ts'

export const handleDragOver = (
  state: MainAreaState,
  eventX: number,
  eventY: number,
  groupIndexRaw?: string,
  tabIndexRaw?: string,
  tabOffsetLeft?: number,
  tabWidth?: number,
  tabsScrollLeft?: number,
): MainAreaState => {
  if (
    groupIndexRaw !== undefined &&
    tabIndexRaw !== undefined &&
    tabOffsetLeft !== undefined &&
    tabWidth !== undefined &&
    tabsScrollLeft !== undefined
  ) {
    return handleTabDragOver(state, groupIndexRaw, tabIndexRaw, tabOffsetLeft, tabWidth, tabsScrollLeft, eventX, eventY)
  }
  return handleEditorDragOver(state, eventX, eventY)
}
