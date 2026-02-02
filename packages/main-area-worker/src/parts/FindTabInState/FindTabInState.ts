import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const findTabInState = (state: MainAreaState, groupId: number, tabId: number): Tab | undefined => {
  const { layout } = state
  const group = layout.groups.find((g) => g.id === groupId)
  return group?.tabs.find((t) => t.id === tabId)
}
