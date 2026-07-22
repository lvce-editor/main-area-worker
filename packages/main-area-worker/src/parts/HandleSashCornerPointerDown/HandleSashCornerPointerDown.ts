import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getSashCorner } from '../GetSashCorner/GetSashCorner.ts'

export const handleSashCornerPointerDown = async (state: MainAreaState, clientX: number, clientY: number): Promise<MainAreaState> => {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return state
  }
  const sashCorner = getSashCorner(state.layout)
  if (!sashCorner) {
    return state
  }
  return {
    ...state,
    sashCornerDrag: {
      groupSizes: state.layout.groups.map((group) => ({
        id: group.id,
        size: group.size,
      })),
      startClientX: clientX,
      startClientY: clientY,
      xAfterGroupIds: sashCorner.xAfterGroupIds,
      xBeforeGroupIds: sashCorner.xBeforeGroupIds,
      yAfterGroupIds: sashCorner.yAfterGroupIds,
      yBeforeGroupIds: sashCorner.yBeforeGroupIds,
    },
  }
}
