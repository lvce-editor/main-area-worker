import type { Tab } from '../MainAreaState/MainAreaState.ts'

export const isHtmlFile = (tab: Tab | undefined): boolean => {
  if (!tab || !tab.uri) {
    return false
  }
  return tab.uri.endsWith('.html')
}
