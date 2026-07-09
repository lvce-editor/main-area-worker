import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

export const getUriTitle = (uri: string | undefined, homeDirUri: string): string | undefined => {
  if (!uri) {
    return undefined
  }
  const title = PathDisplay.getTitle(uri, homeDirUri)
  return title === uri ? undefined : title
}

const updateTabUriTitle = (tab: Tab, homeDirUri: string): Tab => {
  const uriTitle = getUriTitle(tab.uri, homeDirUri)
  if (tab.uriTitle === uriTitle) {
    return tab
  }
  return {
    ...tab,
    uriTitle,
  }
}

export const updateTabUriTitles = (state: MainAreaState): MainAreaState => {
  const { layout } = state
  const homeDirUri = state.homeDirUri || ''
  return {
    ...state,
    layout: {
      ...layout,
      groups: layout.groups.map((group) => ({
        ...group,
        tabs: group.tabs.map((tab) => updateTabUriTitle(tab, homeDirUri)),
      })),
    },
  }
}
