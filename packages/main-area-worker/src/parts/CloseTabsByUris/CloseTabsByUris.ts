import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'

const closeFirstTabByUri = (state: MainAreaState, uri: string): MainAreaState | undefined => {
  const matchingGroup = state.layout.groups.find((group) => {
    return group.tabs.some((tab) => tab.uri === uri)
  })
  const matchingTab = matchingGroup?.tabs.find((tab) => tab.uri === uri)
  if (!matchingGroup || !matchingTab) {
    return undefined
  }
  return closeTab(state, matchingGroup.id, matchingTab.id)
}

export const closeTabsByUris = (state: MainAreaState, uris: readonly string[]): MainAreaState => {
  let currentState = state

  for (const uri of uris) {
    let nextState = closeFirstTabByUri(currentState, uri)
    while (nextState) {
      currentState = nextState
      nextState = closeFirstTabByUri(currentState, uri)
    }
  }

  return currentState
}
