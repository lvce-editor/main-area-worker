import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const hasOpenTextEditor = (state: MainAreaState): boolean => {
  return state.layout.groups.some((group) => group.tabs.some((tab) => !tab.terminal && tab.editorInput?.type === 'editor'))
}
