import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
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
            isPreview: newStatus ? false : tab.isPreview,
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

export const handleModifiedStatusChangeWithContext = async (
  context: AsyncCommandContext<MainAreaState>,
  uri: string,
  newStatus: boolean,
): Promise<void> => {
  await context.updateState((state) => handleModifiedStatusChange(state, uri, newStatus))
}
