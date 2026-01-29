/* eslint-disable no-console */
import type { MainAreaState } from '../MainAreaState/MainAreaState.js'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.js'

export const findFileReferences = (state: MainAreaState): MainAreaState => {
  const activeTabData = getActiveTab(state)
  if (!activeTabData) {
    return state
  }
  const { tab } = activeTabData
  const { uri } = tab
  // TODO show references view

  console.log('show refrences', uri)
  return state
}
