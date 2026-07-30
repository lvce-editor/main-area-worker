import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getMountedViewletUids = (state: MainAreaState): readonly number[] => {
  const mountedViewletUids: number[] = []
  for (const group of state.layout.groups) {
    const activeTab = group.tabs.find((tab) => tab.id === group.activeTabId)
    if (activeTab?.loadingState === 'loaded' && activeTab.editorUid !== -1) {
      mountedViewletUids.push(activeTab.editorUid)
    }
  }
  return mountedViewletUids
}
