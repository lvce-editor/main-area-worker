import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const updateTabs = (state: MainAreaState, editorUids: Record<string, number>): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const updatedGroups = groups.map((group) => {
    const { tabs } = group
    return {
      ...group,
      tabs: tabs.map((tab) => {
        const { id } = tab
        if (editorUids[id]) {
          return {
            ...tab,
            editorUid: editorUids[id],
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
