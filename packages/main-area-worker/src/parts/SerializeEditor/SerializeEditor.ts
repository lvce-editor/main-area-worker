export const serializeEditor = (editor: any): any => {
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
