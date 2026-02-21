import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

const MIN_GROUP_SIZE = 10

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value))
}

const round = (value: number): number => {
  return Math.round(value * 100) / 100
}

export const handleSashPointerMove = async (state: MainAreaState, clientX: number, clientY: number): Promise<MainAreaState> => {
  const { sashDrag } = state
  if (!sashDrag) {
    return state
  }

  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return state
  }

  const axisSize = state.layout.direction === 'horizontal' ? state.width : state.height
  if (!axisSize) {
    return state
  }

  const deltaPx = state.layout.direction === 'horizontal' ? clientX - sashDrag.startClientX : clientY - sashDrag.startClientY
  const deltaPercent = (deltaPx / axisSize) * 100

  const totalResizableSize = sashDrag.beforeSize + sashDrag.afterSize
  const beforeSize = clamp(sashDrag.beforeSize + deltaPercent, MIN_GROUP_SIZE, totalResizableSize - MIN_GROUP_SIZE)
  const afterSize = totalResizableSize - beforeSize

  const groups = state.layout.groups.map((group) => {
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
      ...state.layout,
      groups,
    },
  }
}
