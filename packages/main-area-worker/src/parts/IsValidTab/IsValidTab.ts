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
    (tab.editorInput === undefined ||
      ['binary', 'diff-editor', 'editor', 'extension-detail-view', 'image', 'process-explorer', 'running-extensions', 'video', 'webview'].includes(
        tab.editorInput?.type,
      ))
  )
}
