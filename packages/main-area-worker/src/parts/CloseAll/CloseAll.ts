import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { canCloseTab } from '../CloseTabAndSave/CloseTabAndSave.ts'
import { disposeEditors } from '../DisposeEditors/DisposeEditors.ts'
import { withEmptyGroups } from '../WithEmptyGroups/WithEmptyGroups.ts'

export const closeAll = async (state: MainAreaState): Promise<MainAreaState> => {
  const { layout } = state
  const { groups } = layout
  const tabs = groups.flatMap((group) => group.tabs)
  for (const tab of tabs) {
    if (!(await canCloseTab(tab))) {
      return state
    }
  }
  const editorUids = groups.flatMap((group) => group.tabs.map((tab) => tab.editorUid)).filter((editorUid) => editorUid !== -1)
  await disposeEditors(editorUids)
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
