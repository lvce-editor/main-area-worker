import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getTabCount = (state: MainAreaState): number => {
  const { layout } = state
  const { groups } = layout
  return groups.reduce((sum: number, group: EditorGroup) => sum + group.tabs.length, 0)
}
