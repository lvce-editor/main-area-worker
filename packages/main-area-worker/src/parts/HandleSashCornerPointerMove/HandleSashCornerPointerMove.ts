import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { clamp } from '../Clamp/Clamp.ts'
import { getMinGroupSizePercent } from '../GetMinGroupSizePercent/GetMinGroupSizePercent.ts'
import { round } from '../Round/Round.ts'

const sumGroupSizes = (groupSizes: readonly { readonly id: number; readonly size: number }[], groupIds: readonly number[]): number => {
  return groupSizes.reduce((total, group) => total + (groupIds.includes(group.id) ? group.size : 0), 0)
}

const getBeforeSize = (startSize: number, deltaPx: number, axisSize: number, minSizePx: number, totalSize: number): number => {
  let minSize = getMinGroupSizePercent(axisSize, minSizePx)
  if (2 * minSize > totalSize) {
    minSize = totalSize / 2
  }
  const deltaSize = (deltaPx / axisSize) * totalSize
  return clamp(startSize + deltaSize, minSize, totalSize - minSize)
}

export const handleSashCornerPointerMove = async (state: MainAreaState, clientX: number, clientY: number): Promise<MainAreaState> => {
  const { height, sashCornerDrag, width } = state
  if (!sashCornerDrag || !width || !height || !Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return state
  }

  const { groupSizes, startClientX, startClientY, xBeforeGroupIds, yBeforeGroupIds } = sashCornerDrag
  const totalSize = groupSizes.reduce((total, group) => total + group.size, 0)
  if (!totalSize) {
    return state
  }
  const xBeforeStartSize = sumGroupSizes(groupSizes, xBeforeGroupIds)
  const yBeforeStartSize = sumGroupSizes(groupSizes, yBeforeGroupIds)
  const xBeforeSize = getBeforeSize(xBeforeStartSize, clientX - startClientX, width, state.minGroupWidthPx, totalSize)
  const yBeforeSize = getBeforeSize(yBeforeStartSize, clientY - startClientY, height, state.minGroupHeightPx, totalSize)
  const xAfterSize = totalSize - xBeforeSize
  const yAfterSize = totalSize - yBeforeSize
  const xBeforeGroupIdSet = new Set(xBeforeGroupIds)
  const yBeforeGroupIdSet = new Set(yBeforeGroupIds)

  return {
    ...state,
    layout: {
      ...state.layout,
      groups: state.layout.groups.map((group) => {
        const xSize = xBeforeGroupIdSet.has(group.id) ? xBeforeSize : xAfterSize
        const ySize = yBeforeGroupIdSet.has(group.id) ? yBeforeSize : yAfterSize
        return {
          ...group,
          size: round((xSize * ySize) / totalSize),
        }
      }),
    },
  }
}
