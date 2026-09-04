import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getComponentState = (uid: number): MainAreaState => {
  return MainAreaStates.get(uid).newState
}
