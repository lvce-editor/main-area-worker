import type { Tab } from '../MainAreaState/MainAreaState.ts'

export const isValidTab = (tab: any): tab is Tab => {
  return (
    tab &&
    typeof tab.id === 'number' &&
    typeof tab.title === 'string' &&
    typeof tab.isDirty === 'boolean' &&
    typeof tab.isPreview === 'boolean' &&
    typeof tab.editorUid === 'number' &&
    typeof tab.icon === 'string' &&
    (tab.editorType === 'text' || tab.editorType === 'custom')
  )
}
