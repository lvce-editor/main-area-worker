export const normalizeViewletModuleId = (viewletModuleId: string): string => {
  switch (viewletModuleId) {
    case 'Editor':
    case 'EditorText':
      return 'editor.text'
    default:
      return viewletModuleId
  }
}
