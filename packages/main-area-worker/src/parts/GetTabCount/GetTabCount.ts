import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getTabCount = (state: MainAreaState): number => {
  const { layout } = state
  return layout.groups.reduce((sum: number, group: EditorGroup) => sum + group.tabs.length, 0)
}
