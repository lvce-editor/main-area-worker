import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

export const handleDoubleClick = (state: MainAreaState, groupIndexRaw: string, indexRaw: string): MainAreaState => {
  if (!groupIndexRaw || !indexRaw) {
    return state
  }
  const groupIndex = Number.parseInt(groupIndexRaw)
  const tabIndex = Number.parseInt(indexRaw)
  const tab = state.layout.groups[groupIndex]?.tabs[tabIndex]
  if (!tab?.isPreview) {
    return state
  }
  return updateTab(state, tab.id, {
    isPreview: false,
  })
}
