import * as EditorSplitDirection from '../EditorSplitDirection/EditorSplitDirection.ts'

export const getSplitDirection = (x: number, y: number, width: number, height: number): number => {
  const percentX = x / width
  if (percentX < 0.25) {
    return EditorSplitDirection.Left
  }
  if (percentX > 0.75) {
    return EditorSplitDirection.Right
  }
  const percentY = y / height
  if (percentY < 0.25) {
    return EditorSplitDirection.Up
  }
  if (percentY > 0.75) {
    return EditorSplitDirection.Down
  }
  return EditorSplitDirection.None
}
