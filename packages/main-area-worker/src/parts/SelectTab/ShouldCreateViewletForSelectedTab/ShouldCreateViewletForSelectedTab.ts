import type { Tab } from '../../MainAreaState/MainAreaState.ts'
import * as LoadingState from '../../LoadingState/LoadingState.ts'

export const shouldCreateViewletForSelectedTab = (tab: Tab): boolean => {
  return Boolean(tab.uri) && (tab.editorUid === -1 || !tab.loadingState || tab.loadingState === LoadingState.Loading)
}
