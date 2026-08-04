import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

/**
 * Collects all editorUids from all tabs in all groups.
 * Only returns editorUids that are not -1 (actually created viewlets).
 */
export const getAllEditorUids = (state: MainAreaState): number[] => {
  const { groups } = state.layout
  return groups.flatMap((group) => group.tabs.map((tab) => tab.editorUid)).filter((editorUid) => editorUid !== -1)
}
