import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { disposeEditors } from '../DisposeEditors/DisposeEditors.ts'
import { withEmptyGroups } from '../WithEmptyGroups/WithEmptyGroups.ts'

export const closeAll = async (state: MainAreaState): Promise<MainAreaState> => {
  const editorUids = state.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.editorUid)).filter((editorUid) => editorUid !== -1)
  await disposeEditors(editorUids)
  const entries = state.layout.groups.flatMap((group, groupIndex) => {
    return group.tabs.map((tab, tabIndex) => ({
      group,
      groupIndex,
      tab,
      tabIndex,
    }))
  })
  return withEmptyGroups(addClosedTabs(state, entries))
}
