export const getEditorGroupSegmentClassName = (groupId: number): string => {
  return `EditorGroupSegment-${String(groupId).replaceAll('.', '-')}`
}
