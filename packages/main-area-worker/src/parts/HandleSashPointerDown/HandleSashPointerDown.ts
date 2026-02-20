import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as SashId from '../SashId/SashId.ts'

export const handleSashPointerDown = async (state: MainAreaState, sashId: string, clientXRaw: string, clientYRaw: string): Promise<MainAreaState> => {
  const parsed = SashId.parse(sashId)
  if (!parsed) {
    return state
  }
  const beforeGroup = state.layout.groups.find((group) => group.id === parsed.beforeGroupId)
  const afterGroup = state.layout.groups.find((group) => group.id === parsed.afterGroupId)
  if (!beforeGroup || !afterGroup) {
    return state
  }
  const clientX = Number.parseFloat(clientXRaw)
  const clientY = Number.parseFloat(clientYRaw)
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return state
  }
  return {
    ...state,
    sashDrag: {
      afterGroupId: parsed.afterGroupId,
      afterSize: afterGroup.size,
      beforeGroupId: parsed.beforeGroupId,
      beforeSize: beforeGroup.size,
      sashId,
      startClientX: clientX,
      startClientY: clientY,
    },
  }
}
