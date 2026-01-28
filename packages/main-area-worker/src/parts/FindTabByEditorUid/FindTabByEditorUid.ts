import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const findTabByEditorUid = (state: MainAreaState, editorUid: number): Tab | undefined => {
  const { layout } = state
  const { groups } = layout
  for (const group of groups) {
    const tab = group.tabs.find((t) => t.editorUid === editorUid)
    if (tab) {
      return tab
    }
  }
  return undefined
}
