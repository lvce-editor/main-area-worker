import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'

export const getSelectedTabBounds = (state: MainAreaState) => {
  return {
    height: state.height - state.tabHeight,
    width: state.width,
    x: state.x,
    y: state.y + state.tabHeight,
  }
}
