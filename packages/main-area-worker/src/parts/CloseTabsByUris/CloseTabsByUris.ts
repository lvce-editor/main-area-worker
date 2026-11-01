import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'
import { disposeEditors } from '../DisposeEditors/DisposeEditors.ts'

const closeFirstTabByUri = (state: MainAreaState, uri: string): MainAreaState | undefined => {
  const { layout } = state
  const { groups } = layout
  const matchingGroup = groups.find((group) => {
    return group.tabs.some((tab) => tab.uri === uri)
  })
  const matchingTab = matchingGroup?.tabs.find((tab) => tab.uri === uri)
  if (!matchingGroup || !matchingTab) {
    return undefined
  }
  return closeTab(state, matchingGroup.id, matchingTab.id)
}

export const closeTabsByUris = async (state: MainAreaState, uris: readonly string[]): Promise<MainAreaState> => {
  const uriSet = new Set(uris)
  const editorUids = state.layout.groups.flatMap((group) =>
    group.tabs.filter((tab) => tab.editorUid !== -1 && uriSet.has(tab.uri!)).map((tab) => tab.editorUid),
  )
  await disposeEditors(editorUids)
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
