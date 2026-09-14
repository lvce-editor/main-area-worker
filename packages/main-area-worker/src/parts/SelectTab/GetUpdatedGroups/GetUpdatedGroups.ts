import type { MainAreaState, Tab } from '../../MainAreaState/MainAreaState.ts'
import * as LoadingState from '../../LoadingState/LoadingState.ts'

export const getUpdatedGroups = (
  groups: readonly MainAreaState['layout']['groups'][number][],
  groupIndex: number,
  needsLoading: boolean,
  tabId: number,
): MainAreaState['layout']['groups'] => {
  return groups.map((group, index) => {
    if (index !== groupIndex) {
      return {
        ...group,
        focused: false,
      }
    }

    const tabs = needsLoading
      ? group.tabs.map((tab): Tab => {
          if (tab.id !== tabId) {
            return tab
          }
          return {
            ...tab,
            errorMessage: '',
            loadingState: LoadingState.Loading,
          }
        })
      : group.tabs

    return {
      ...group,
      activeTabId: tabId,
      focused: true,
      tabs,
    }
  })
}
