import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'

export const handleClickTab = async (state: MainAreaState, groupIndexRaw: string, indexRaw: string, button: number = 0): Promise<MainAreaState> => {
  if (button !== 0) {
    return state
  }
  if (!groupIndexRaw || !indexRaw) {
    return state
  }
  const groupIndex = Number.parseInt(groupIndexRaw)
  const index = Number.parseInt(indexRaw)
  const group = state.layout.groups[groupIndex]
  if (!group || index < 0 || index >= group.tabs.length) {
    return state
  }
  const newState = await selectTab(state, groupIndex, index)
  return {
    ...newState,
    pointerDownGroupIndex: groupIndex,
    pointerDownTabIndex: index,
  }
}
