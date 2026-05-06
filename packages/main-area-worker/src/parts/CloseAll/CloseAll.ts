import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { withEmptyGroups } from '../WithEmptyGroups/WithEmptyGroups.ts'

export const closeAll = (state: MainAreaState): MainAreaState => {
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
