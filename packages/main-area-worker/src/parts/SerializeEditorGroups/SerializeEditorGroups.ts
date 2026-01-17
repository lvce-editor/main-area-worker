import * as SerializeEditors from '../SerializeEditors/SerializeEditors.ts'

const serializeEditorGroup = (group: any): any => {
  const { activeIndex, editors, height, tabsDeltaX, width, x, y } = group
  return {
    activeIndex,
    editors: SerializeEditors.serializeEditors(editors),
    height,
    tabsDeltaX,
    width,
    x,
    y,
  }
}

export const serializeEditorGroups = (groups: readonly any[]): readonly any[] => {
  return groups.map(serializeEditorGroup)
}
