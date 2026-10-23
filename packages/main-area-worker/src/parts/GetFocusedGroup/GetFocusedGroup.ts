import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

const isFocused = (group: EditorGroup): boolean => {
  return group.isFocused
}

export const getFocusedGroup = (state: MainAreaState): EditorGroup | undefined => {
  const { layout } = state
  const { groups } = layout
  return groups.find(isFocused)
}
