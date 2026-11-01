import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { withEmptyGroups } from '../WithEmptyGroups/WithEmptyGroups.ts'

export const closeAll = async (state: MainAreaState): Promise<MainAreaState> => {
  const { layout } = state
  const { groups } = layout
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
