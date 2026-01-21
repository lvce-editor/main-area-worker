import * as SerializeEditors from '../SerializeEditors/SerializeEditors.ts'

export const serializeEditorGroup = (group: any): any => {
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
