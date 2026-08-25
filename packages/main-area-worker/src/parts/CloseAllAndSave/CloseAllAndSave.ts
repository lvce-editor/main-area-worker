import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeAll } from '../CloseAll/CloseAll.ts'
import { canCloseTab } from '../CloseTabAndSave/CloseTabAndSave.ts'

export const closeAllAndSave = async (state: MainAreaState): Promise<MainAreaState> => {
  const tabs = state.layout.groups.flatMap((group) => group.tabs)
  for (const tab of tabs) {
    if (!(await canCloseTab(tab))) {
      return state
    }
  }
  return closeAll(state)
}
