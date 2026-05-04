import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getTabCount } from '../GetTabCount/GetTabCount.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'

export const getCurrentState = (state: MainAreaState): MainAreaState => {
  const { uid } = state
  const stateFromStore = get(uid)
  if (!stateFromStore) {
    set(uid, state, state)
    return state
  }

  const storedState = stateFromStore.newState
  if (getTabCount(storedState) > getTabCount(state)) {
    return storedState
  }

  set(uid, state, state)
  return state
}
