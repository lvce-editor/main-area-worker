import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import type { LayoutDirection } from '../LayoutDirection/LayoutDirection.ts'

export interface GroupSegment {
  readonly direction: LayoutDirection | undefined
  readonly groups: readonly EditorGroup[]
  readonly startIndex: number
}

export const getSegmentSize = (segment: GroupSegment): number => {
  return segment.groups.reduce((total, group) => total + group.size, 0)
}

export const getGroupSegments = (groups: readonly EditorGroup[], parentDirection: LayoutDirection): readonly GroupSegment[] => {
  const segments: GroupSegment[] = []
  let index = 0
  while (index < groups.length) {
    const group = groups[index]
    if (group.direction !== undefined && group.direction !== parentDirection) {
      const startIndex = index
      const nestedGroups = [group]
      index++
      while (index < groups.length && groups[index].direction === group.direction) {
        nestedGroups.push(groups[index])
        index++
      }
      segments.push({
        direction: group.direction,
        groups: nestedGroups,
        startIndex,
      })
      continue
    }
    segments.push({
      direction: undefined,
      groups: [group],
      startIndex: index,
    })
    index++
  }
  return segments
}
