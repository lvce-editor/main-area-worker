import type { Tab } from '../../MainAreaState/MainAreaState.ts'

export const shouldCreateViewletForSelectedTab = (tab: Tab): boolean => {
  return Boolean(tab.uri) && (tab.editorUid === -1 || !tab.loadingState || tab.loadingState === 'loading')
}
