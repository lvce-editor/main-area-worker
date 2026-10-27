import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { disposeEditors } from '../DisposeEditors/DisposeEditors.ts'
import { withEmptyGroups } from '../WithEmptyGroups/WithEmptyGroups.ts'

export const closeAll = async (state: MainAreaState): Promise<MainAreaState> => {
  const { layout } = state
  const { groups } = layout
  const editorUids = groups.flatMap((group) => group.tabs.map((tab) => tab.editorUid)).filter((editorUid) => editorUid !== -1)
  if (editorUids.length > 0) {
    setTimeout(() => {
      void disposeEditors(editorUids)
    }, 50)
  }
  const entries = groups.flatMap((group, groupIndex) => {
    return group.tabs.map((tab, tabIndex) => ({
      group,
      groupIndex,
      tab,
      tabIndex,
    }))
  })
  return withEmptyGroups(addClosedTabs(state, entries))
}
