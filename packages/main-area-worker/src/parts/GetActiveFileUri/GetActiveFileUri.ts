import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getActiveFileUri = (state: MainAreaState): string => {
  const { activeGroupId, groups } = state.layout
  const activeGroup = groups.find((group) => group.id === activeGroupId)
  const activeTab = activeGroup?.tabs.find((tab) => tab.id === activeGroup.activeTabId)
  if (!activeTab) {
    return ''
  }
  if (typeof activeTab.uri === 'string') {
    return activeTab.uri
  }
  const { editorInput } = activeTab
  return editorInput && 'uri' in editorInput ? editorInput.uri : ''
}
