const serializeEditor = (editor: any): any => {
  const { icon, label, preview, tabWidth, uid, uri } = editor
  return {
    icon,
    label,
    preview,
    tabWidth,
    uid,
    uri,
  }
}

export const serializeEditors = (editors: readonly any[]): readonly any[] => {
  return editors.map(serializeEditor)
}
