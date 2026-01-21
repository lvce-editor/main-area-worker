import * as SerializeEditorGroup from '../SerializeEditorGroup/SerializeEditorGroup.ts'

export const serializeEditorGroups = (groups: readonly any[]): readonly any[] => {
  return groups.map(SerializeEditorGroup.serializeEditorGroup)
}
