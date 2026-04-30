import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

const MIN_GROUP_WIDTH_PX = 250

export const getSashOffset = (layout: MainAreaLayout, groupIndex: number, width: number): string => {
  const { direction, groups } = layout
  const percentOffset = groups.slice(0, groupIndex).reduce((total, group) => total + group.size, 0)

  if (direction !== LayoutDirection.Horizontal || !width || !Number.isFinite(width)) {
    return `${percentOffset}%`
  }

  const effectiveGroupSizes = groups.map((group) => Math.max((group.size / 100) * width, MIN_GROUP_WIDTH_PX))
  const hasOverflowingGroups = effectiveGroupSizes.some((size, index) => size !== (groups[index].size / 100) * width)

  if (!hasOverflowingGroups) {
    return `${percentOffset}%`
  }

  const pixelOffset = effectiveGroupSizes.slice(0, groupIndex).reduce((total, size) => total + size, 0)
  return `${pixelOffset}px`
}
