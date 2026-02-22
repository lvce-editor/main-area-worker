import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getFocusedGroup = (state: MainAreaState): EditorGroup | undefined => {
  const { layout } = state
  const { groups } = layout
  return groups.find((group) => group.focused)
}
