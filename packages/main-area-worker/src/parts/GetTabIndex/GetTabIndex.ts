import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'

export const getTabIndex = (group: EditorGroup, tabId: number): number => {
  return group.tabs.findIndex((tab) => tab.id === tabId)
}
