import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { restoreClosedTabState } from '../RestoreClosedTabState/RestoreClosedTabState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'

export const restoreClosedTab = async (state: MainAreaState): Promise<MainAreaState> => {
  const restored = restoreClosedTabState(state)
  if (!restored) {
    return state
  }

  return selectTab(restored.newState, restored.groupIndex, restored.tabIndex)
}