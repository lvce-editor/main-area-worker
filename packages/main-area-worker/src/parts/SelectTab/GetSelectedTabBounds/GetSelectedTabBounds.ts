import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'

export const getSelectedTabBounds = (state: MainAreaState) => {
  const { height, tabHeight, width, x, y } = state
  return {
    height: height - tabHeight,
    width,
    x,
    y: y + tabHeight,
  }
}
