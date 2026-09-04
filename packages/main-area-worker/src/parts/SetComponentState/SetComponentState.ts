import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

const applyComponentState = (currentState: MainAreaState, state: MainAreaState): MainAreaState => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Main Area state must be an object')
  }
  if (state.uid !== currentState.uid) {
    throw new Error(`Main Area state uid must remain ${currentState.uid}`)
  }
  return state
}

export const setComponentState = MainAreaStates.wrapSerialCommand(applyComponentState)
