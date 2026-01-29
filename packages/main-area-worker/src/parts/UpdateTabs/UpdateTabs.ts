import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const updateTabs = (state: MainAreaState, editorUids: Record<string, number>): MainAreaState => {
  const updatedGroups = state.layout.groups.map((group) => {
    return {
      ...group,
      tabs: group.tabs.map((tab) => {
        if (editorUids[tab.id]) {
          return {
            ...tab,
            editorUid: editorUids[tab.id],
          }
        }
        return tab
      }),
    }
  })

  return {
    ...state,
    layout: {
      ...state.layout,
      groups: updatedGroups,
    },
  }
}
