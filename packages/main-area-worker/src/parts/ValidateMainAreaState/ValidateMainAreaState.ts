import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { isValidEditorGroup } from '../IsValidEditorGroup/IsValidEditorGroup.ts'

export const validateMainAreaState = (state: any): state is MainAreaState => {
  if (!state || typeof state.assetDir !== 'string' || typeof state.platform !== 'number' || !state.layout) {
    return false
  }
  const { layout } = state
  const { groups, activeGroupId, direction } = layout
  return (
    Array.isArray(groups) &&
    groups.every(isValidEditorGroup) &&
    (activeGroupId === undefined || typeof activeGroupId === 'number') &&
    (direction === 'horizontal' || direction === 'vertical') &&
    typeof state.uid === 'number'
  )
}
