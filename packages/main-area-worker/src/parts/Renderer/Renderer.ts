import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export interface Renderer {
  (oldState: MainAreaState, newState: MainAreaState): readonly any[]
}
