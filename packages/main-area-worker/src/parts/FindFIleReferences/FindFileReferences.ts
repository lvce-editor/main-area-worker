import type { MainAreaState } from '../MainAreaState/MainAreaState.js'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.js'

export const findFileReferences = (state: MainAreaState): MainAreaState => {
  const activeTabData = getActiveTab(state)
  if (!activeTabData) {
    return state
  }
  const { tab } = activeTabData
  // @ts-ignore
  const { uri } = tab
  // TODO show references view

  return state
}
