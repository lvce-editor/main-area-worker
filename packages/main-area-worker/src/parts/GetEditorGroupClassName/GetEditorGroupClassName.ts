export const getEditorGroupClassName = (groupId: number): string => {
  return `EditorGroup-${String(groupId).replaceAll('.', '-')}`
}
