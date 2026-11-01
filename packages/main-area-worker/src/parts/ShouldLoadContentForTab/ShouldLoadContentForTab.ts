import type { Tab } from '../Tab/Tab.ts'
import * as LoadingState from '../LoadingState/LoadingState.ts'

export const shouldLoadContentForTab = (tab: Tab): boolean => {
  if (tab.editorInput && tab.editorInput.type !== 'editor') {
    return false
  }
  if (!tab.uri) {
    return false
  }
  if (tab.loadingState === LoadingState.Loading) {
    return false
  }
  return tab.loadingState !== LoadingState.Loaded || tab.editorUid === -1
}
