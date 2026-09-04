import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'

export const getComponentState = (uid: number): MainAreaState => {
  return MainAreaStates.get(uid).newState
}
