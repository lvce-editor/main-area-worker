import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import { getEditorGroupContentBounds } from '../../GetEditorGroupBounds/GetEditorGroupBounds.ts'

export const getSelectedTabBounds = (state: MainAreaState, groupId: number = state.layout.activeGroupId) => {
  const { height, layout, tabHeight, width, x, y } = state
  const bounds = getEditorGroupContentBounds(layout, { height, width, x, y }, tabHeight).find((item) => item.groupId === groupId)
  if (!bounds) {
    return {
      height: height - tabHeight,
      width,
      x,
      y: y + tabHeight,
    }
  }
  return {
    height: bounds.height,
    width: bounds.width,
    x: bounds.x,
    y: bounds.y,
  }
}
