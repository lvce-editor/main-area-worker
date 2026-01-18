import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const findTabByUri = (state: MainAreaState, uri: string): { tab: Tab; groupId: number } | undefined => {
  const { layout } = state
  const { groups } = layout
  for (const group of groups) {
    const tab = group.tabs.find((t) => t.path === uri)
    if (tab) {
      return { groupId: group.id, tab }
    }
  }
  return undefined
}
