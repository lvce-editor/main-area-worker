import type { Tab } from '../MainAreaState/MainAreaState.ts'

export const isValidTab = (tab: any): tab is Tab => {
  return (
    tab &&
    typeof tab.id === 'number' &&
    typeof tab.title === 'string' &&
    typeof tab.content === 'string' &&
    typeof tab.isDirty === 'boolean' &&
    (tab.editorType === 'text' || tab.editorType === 'custom') &&
    (tab.editorType !== 'custom' || typeof tab.customEditorId === 'string')
  )
}
