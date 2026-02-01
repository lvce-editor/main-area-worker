import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

export const handleUriChange = (state: MainAreaState, oldUri: string, newUri: string): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const newTitle = PathDisplay.getLabel(newUri)
  const updatedGroups = groups.map((group) => {
    return {
      ...group,
      tabs: group.tabs.map((tab) => {
        if (tab.uri === oldUri) {
          return {
            ...tab,
            title: newTitle,
            uri: newUri,
          }
        }
        return tab
      }),
    }
  })

  return {
    ...state,
    layout: {
      ...layout,
      groups: updatedGroups,
    },
  }
}
