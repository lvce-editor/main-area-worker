import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { isValidEditorGroup } from '../IsValidEditorGroup/IsValidEditorGroup.ts'

export const isValidMainAreaLayout = (layout: unknown): layout is MainAreaLayout => {
  if (!layout || typeof layout !== 'object') {
    return false
  }

  const layoutObj = layout as Record<string, unknown>

  if (layoutObj.activeGroupId !== undefined && typeof layoutObj.activeGroupId !== 'number') {
    return false
  }

  if (layoutObj.direction !== 'horizontal' && layoutObj.direction !== 'vertical') {
    return false
  }

  if (!Array.isArray(layoutObj.groups)) {
    return false
  }

  if (!layoutObj.groups.every(isValidEditorGroup)) {
    return false
  }

  return true
}
