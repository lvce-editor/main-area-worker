import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleModifiedStatusChange = (state: MainAreaState, uri: string, newStatus: boolean): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const updatedGroups = groups.map((group) => {
    return {
      ...group,
      tabs: group.tabs.map((tab) => {
        if (tab.uri === uri) {
          return {
            ...tab,
            isDirty: newStatus,
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
