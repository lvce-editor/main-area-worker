import * as SerializeEditor from '../SerializeEditor/SerializeEditor.ts'

export const serializeEditors = (editors: readonly any[]): readonly any[] => {
  return editors.map(SerializeEditor.serializeEditor)
}
