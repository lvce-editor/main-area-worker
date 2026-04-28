import type { Tab } from '../Tab/Tab.ts'

export const shouldLoadContentForTab = (tab: Tab): boolean => {
  if (tab.editorInput && tab.editorInput.type !== 'editor') {
    return false
  }
  if (!tab.uri) {
    return false
  }
  if (tab.loadingState === 'loading') {
    return false
  }
  if (tab.loadingState === 'loaded' && tab.editorUid !== -1) {
    return false
  }
  return true
}
