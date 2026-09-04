import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'

const applyComponentState = (currentState: MainAreaState, state: MainAreaState): MainAreaState => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Main Area state must be an object')
  }
  const { maxOpenEditorGroups, maxOpenEditors, uid } = state
  const { maxOpenEditorGroups: currentMaxOpenEditorGroups, maxOpenEditors: currentMaxOpenEditors, uid: currentUid } = currentState
  if (uid !== currentUid) {
    throw new Error(`Main Area state uid must remain ${currentUid}`)
  }
  return {
    ...state,
    maxOpenEditorGroups: maxOpenEditorGroups ?? currentMaxOpenEditorGroups,
    maxOpenEditors: maxOpenEditors ?? currentMaxOpenEditors,
  }
}

export const setComponentState = MainAreaStates.wrapSerialCommand(applyComponentState)
