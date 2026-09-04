import type { ClosedTabEntry, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ClosedTabsStorage from '../ClosedTabsStorage/ClosedTabsStorage.ts'

export const addClosedTabs = (state: MainAreaState, entries: readonly ClosedTabEntry[]): MainAreaState => {
  if (entries.length === 0) {
    return state
  }
  void ClosedTabsStorage.add(state.uid, entries)
  return state
}
