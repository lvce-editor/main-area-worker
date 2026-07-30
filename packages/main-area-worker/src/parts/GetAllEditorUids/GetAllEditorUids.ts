import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

/**
 * Collects all editorUids from all tabs in all groups.
 * Only returns editorUids that are not -1 (actually created viewlets).
 */
export const getAllEditorUids = (state: MainAreaState): number[] => {
  const { layout } = state
  const { groups } = layout
  const editorUids: number[] = []

  for (const group of groups) {
    for (const tab of group.tabs) {
      if (tab.editorUid !== -1) {
        editorUids.push(tab.editorUid)
      }
    }
  }

  return editorUids
}
