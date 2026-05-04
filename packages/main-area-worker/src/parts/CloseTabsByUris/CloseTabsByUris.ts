import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'

export const closeTabsByUris = (state: MainAreaState, uris: readonly string[]): MainAreaState => {
  let currentState = state

  for (const uri of uris) {
    while (true) {
      const matchingGroup = currentState.layout.groups.find((group) => {
        return group.tabs.some((tab) => tab.uri === uri)
      })
      if (!matchingGroup) {
        break
      }
      const matchingTab = matchingGroup.tabs.find((tab) => tab.uri === uri)
      if (!matchingTab) {
        break
      }
      currentState = closeTab(currentState, matchingGroup.id, matchingTab.id)
    }
  }

  return currentState
}
