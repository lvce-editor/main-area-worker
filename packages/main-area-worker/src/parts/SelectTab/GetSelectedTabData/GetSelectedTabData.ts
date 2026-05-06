import type { MainAreaState, Tab } from '../../MainAreaState/MainAreaState.ts'

export interface SelectedTabData {
  readonly group: MainAreaState['layout']['groups'][number]
  readonly groupId: number
  readonly tab: Tab
  readonly tabId: number
}

export const getSelectedTabData = (state: MainAreaState, groupIndex: number, index: number): SelectedTabData | undefined => {
  const group = state.layout.groups[groupIndex]
  if (!group || index < 0 || index >= group.tabs.length) {
    return undefined
  }
  const tab = group.tabs[index]
  return {
    group,
    groupId: group.id,
    tab,
    tabId: tab.id,
  }
}
