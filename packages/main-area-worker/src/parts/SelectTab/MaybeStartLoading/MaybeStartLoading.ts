import type { MainAreaState, Tab } from '../../MainAreaState/MainAreaState.ts'
import { startContentLoading } from '../../StartContentLoading/StartContentLoading.ts'

export const maybeStartLoading = async (
  state: MainAreaState,
  newState: MainAreaState,
  tabId: number,
  tab: Tab,
  needsLoading: boolean,
  requestId: number,
): Promise<MainAreaState> => {
  if (needsLoading && tab.uri) {
    return startContentLoading(state, newState, tabId, tab.uri, requestId)
  }
  return newState
}
