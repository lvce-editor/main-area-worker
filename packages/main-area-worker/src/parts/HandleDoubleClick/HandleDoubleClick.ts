import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

export const handleDoubleClick = (state: MainAreaState, groupIndexRaw: string, indexRaw: string): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  if (!groupIndexRaw || !indexRaw) {
    return state
  }
  const groupIndex = Number.parseInt(groupIndexRaw)
  const tabIndex = Number.parseInt(indexRaw)
  const tab = groups[groupIndex]?.tabs[tabIndex]
  if (!tab?.isPreview) {
    return state
  }
  return updateTab(state, tab.id, {
    isPreview: false,
  })
}
