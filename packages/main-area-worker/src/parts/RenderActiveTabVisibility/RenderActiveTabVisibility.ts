import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const renderActiveTabVisibility = (oldState: MainAreaState, newState: MainAreaState): readonly any[] => {
  const { activeGroupId, groups } = newState.layout
  const groupIndex = groups.findIndex((group) => group.id === activeGroupId)
  if (groupIndex === -1) {
    return []
  }
  const group = groups[groupIndex]
  const tabIndex = group.tabs.findIndex((tab) => tab.id === group.activeTabId)
  if (tabIndex === -1) {
    return []
  }
  const selector = `.${ClassNames.MainTab}[data-group-index="${groupIndex}"][data-index="${tabIndex}"]`
  return ['Viewlet.scrollSelectorIntoView', newState.uid, selector]
}
