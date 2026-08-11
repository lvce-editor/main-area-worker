import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import type { LayoutDirection } from '../LayoutDirection/LayoutDirection.ts'
import { getGroupSegments } from '../GetGroupSegments/GetGroupSegments.ts'

const collapseGroup = (group: EditorGroup, direction: LayoutDirection): EditorGroup => {
  const { segmentId, ...rest } = group
  return {
    ...rest,
    direction,
  }
}

export const collapseSingleGroupSegments = (groups: readonly EditorGroup[], direction: LayoutDirection): readonly EditorGroup[] => {
  const singleGroupSegmentIds = new Set(
    getGroupSegments(groups, direction)
      .filter((segment) => segment.direction !== undefined && segment.groups.length === 1)
      .map((segment) => segment.groups[0].id),
  )
  if (singleGroupSegmentIds.size === 0) {
    return groups
  }
  return groups.map((group) => (singleGroupSegmentIds.has(group.id) ? collapseGroup(group, direction) : group))
}
