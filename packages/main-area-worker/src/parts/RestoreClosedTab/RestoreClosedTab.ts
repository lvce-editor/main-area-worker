import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ClosedTabsStorage from '../ClosedTabsStorage/ClosedTabsStorage.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import { restoreClosedTabState } from '../RestoreClosedTabState/RestoreClosedTabState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'

export const restoreClosedTab = async (state: MainAreaState): Promise<MainAreaState> => {
  const entry = await ClosedTabsStorage.takeLast(state.uid)
  if (!entry) {
    return state
  }
  const restored = restoreClosedTabState(state, entry)
  const newState = await selectTab(restored.newState, restored.groupIndex, restored.tabIndex)
  MainAreaStates.set(state.uid, state, newState)
  return newState
}
