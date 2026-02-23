import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as SashId from '../SashId/SashId.ts'

export const handleSashPointerDown = async (state: MainAreaState, sashId: string, clientX: number, clientY: number): Promise<MainAreaState> => {
  const parsed = SashId.parse(sashId)
  if (!parsed) {
    return state
  }
  const { layout } = state
  const { groups } = layout
  const beforeGroup = groups.find((group) => group.id === parsed.beforeGroupId)
  const afterGroup = groups.find((group) => group.id === parsed.afterGroupId)
  if (!beforeGroup || !afterGroup) {
    return state
  }
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
