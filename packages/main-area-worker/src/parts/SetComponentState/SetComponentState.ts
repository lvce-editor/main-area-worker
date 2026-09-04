import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'

const applyComponentState = (currentState: MainAreaState, state: MainAreaState): MainAreaState => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Main Area state must be an object')
  }
  const { uid } = state
  const { uid: currentUid } = currentState
  if (uid !== currentUid) {
    throw new Error(`Main Area state uid must remain ${currentUid}`)
  }
  return state
}

export const setComponentState = MainAreaStates.wrapSerialCommand(applyComponentState)
