import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'

export const handleClickTab = async (state: MainAreaState, groupIndexRaw: string, indexRaw: string): Promise<MainAreaState> => {
  if (!groupIndexRaw || !indexRaw) {
    return state
  }
  const groupIndex = Number.parseInt(groupIndexRaw)
  const index = Number.parseInt(indexRaw)
  return selectTab(state, groupIndex, index)
}
