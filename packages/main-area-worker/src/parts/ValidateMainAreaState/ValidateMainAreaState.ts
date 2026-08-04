import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { isValidEditorGroup } from '../IsValidEditorGroup/IsValidEditorGroup.ts'
import { isLayoutDirection } from '../LayoutDirection/LayoutDirection.ts'

export const validateMainAreaState = (state: any): state is MainAreaState => {
  if (!state) {
    return false
  }
  const { assetDir, layout, platform, uid } = state
  if (typeof assetDir !== 'string' || typeof platform !== 'number' || !layout) {
    return false
  }
  const { activeGroupId, direction, groups } = layout
  return (
    Array.isArray(groups) &&
    groups.every(isValidEditorGroup) &&
    typeof activeGroupId === 'number' &&
    isLayoutDirection(direction) &&
    typeof uid === 'number'
  )
}
