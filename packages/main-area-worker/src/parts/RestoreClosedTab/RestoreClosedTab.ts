import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import { restoreClosedTabState } from '../RestoreClosedTabState/RestoreClosedTabState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'

export const restoreClosedTab = async (state: MainAreaState): Promise<MainAreaState> => {
  const restored = restoreClosedTabState(state)
  if (!restored) {
    return state
  }

  const newState = await selectTab(restored.newState, restored.groupIndex, restored.tabIndex)
  MainAreaStates.set(state.uid, state, newState)
  return newState
}
