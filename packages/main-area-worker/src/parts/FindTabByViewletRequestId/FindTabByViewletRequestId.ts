import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const findTabByViewletRequestId = (state: MainAreaState, requestId: number): Tab | undefined => {
  const { layout } = state
  const { groups } = layout
  for (const group of groups) {
    const tab = group.tabs.find((t) => t.viewletRequestId === requestId)
    if (tab) {
      return tab
    }
  }
  return undefined
}
