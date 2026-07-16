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
  return selectTab(state, groupIndex, index)
}
