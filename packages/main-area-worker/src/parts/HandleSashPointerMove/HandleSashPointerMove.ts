import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { clamp } from '../Clamp/Clamp.ts'
import { getMinGroupSizePercent } from '../GetMinGroupSizePercent/GetMinGroupSizePercent.ts'
import { round } from '../Round/Round.ts'

export const handleSashPointerMove = async (state: MainAreaState, clientX: number, clientY: number): Promise<MainAreaState> => {
  const { height, layout, sashDrag, width } = state
  if (!sashDrag) {
    return state
  }

  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return state
  }
  const { direction, groups } = layout

  const axisSize = direction === 'horizontal' ? width : height
  if (!axisSize) {
    return state
  }

  const deltaPx = direction === 'horizontal' ? clientX - sashDrag.startClientX : clientY - sashDrag.startClientY
  const deltaPercent = (deltaPx / axisSize) * 100

  const totalResizableSize = sashDrag.beforeSize + sashDrag.afterSize
  let minGroupSize = getMinGroupSizePercent(axisSize, state.minGroupWidthPx)

  // If the minimum size makes it impossible to fit two groups, relax the constraint
  if (2 * minGroupSize > totalResizableSize) {
    minGroupSize = totalResizableSize / 2
  }

  const beforeSize = clamp(sashDrag.beforeSize + deltaPercent, minGroupSize, totalResizableSize - minGroupSize)
  const afterSize = totalResizableSize - beforeSize

  const newGroups = groups.map((group) => {
    if (group.id === sashDrag.beforeGroupId) {
      return {
        ...group,
        size: round(beforeSize),
      }
    }
    if (group.id === sashDrag.afterGroupId) {
      return {
        ...group,
        size: round(afterSize),
      }
    }
    return group
  })

  return {
    ...state,
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}
