import type { ClosedTabEntry, MainAreaState } from '../MainAreaState/MainAreaState.ts'

const maxClosedTabs = 20

export const addClosedTabs = (state: MainAreaState, entries: readonly ClosedTabEntry[]): MainAreaState => {
  if (entries.length === 0) {
    return state
  }

  return {
    ...state,
    closedTabs: [...state.closedTabs, ...entries].slice(-maxClosedTabs),
  }
}
