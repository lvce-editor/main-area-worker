import type { DragOverlay, EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getEditorGroupBounds } from '../GetEditorGroupBounds/GetEditorGroupBounds.ts'
import { getOverlay } from '../GetOverlay/GetOverlay.ts'
import { getSplitDirection } from '../GetSplitDirection/GetSplitDirection.ts'

const isNotEmpty = (group: EditorGroup): boolean => {
  return !group.isEmpty
}

const getContentOffsetY = (targetIsEmpty: boolean | undefined, hasOpenEditor: boolean, tabHeight: number): number => {
  if (targetIsEmpty !== undefined) {
    return targetIsEmpty ? 0 : tabHeight
  }
  return hasOpenEditor ? tabHeight : 0
}

export const getDragOverlay = (state: MainAreaState, eventX: number, eventY: number): DragOverlay => {
  const { height, layout, tabHeight, width, x, y } = state
  const { groups } = layout
  const relativeEventX = Math.min(Math.max(eventX - x, 0), width)
  const relativeEventY = Math.min(Math.max(eventY - y, 0), height)
  const groupBounds = getEditorGroupBounds(layout, width, height)
  const target = groupBounds.find((bounds) => {
    return (
      relativeEventX >= bounds.x &&
      relativeEventX <= bounds.x + bounds.width &&
      relativeEventY >= bounds.y &&
      relativeEventY <= bounds.y + bounds.height
    )
  })
  const hasOpenEditor = groups.some(isNotEmpty)
  const targetX = target?.x ?? 0
  const targetY = target?.y ?? 0
  const targetWidth = target?.width ?? width
  const targetHeight = target?.height ?? height
  const contentOffsetY = getContentOffsetY(target?.group.isEmpty, hasOpenEditor, tabHeight)
  const contentY = targetY + contentOffsetY
  const contentHeight = Math.max(0, targetHeight - contentOffsetY)
  const relativeX = relativeEventX - targetX
  const relativeY = relativeEventY - contentY
  const splitDirection = getSplitDirection(relativeX, relativeY, targetWidth, contentHeight)
  return {
    ...getOverlay(targetX, contentY, targetWidth, contentHeight, splitDirection),
    ...(target && { targetGroupId: target.group.id }),
  }
}
