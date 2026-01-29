import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'

export const handleResize = (state: MainAreaState, x: number, y: number, width: number, height: number): MainAreaState => {
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)

  return {
    ...state,
    height,
    width,
    x,
    y,
  }
}
