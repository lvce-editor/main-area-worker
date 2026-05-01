import type { MainAreaState } from '../MainAreaState/MainAreaState.js'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.js'

export const findFileReferences = (state: MainAreaState): MainAreaState => {
  if (!getActiveTab(state)) {
    return state
  }

  // TODO show references view

  return state
}
