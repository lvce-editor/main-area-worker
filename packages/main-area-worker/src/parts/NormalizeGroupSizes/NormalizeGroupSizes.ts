import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'

export const normalizeGroupSizes = (groups: readonly EditorGroup[]): EditorGroup[] => {
  const totalSize = groups.reduce((sum, group) => sum + group.size, 0)
  if (totalSize === 0) {
    return groups.map((group) => ({ ...group, size: Math.round(100 / groups.length) }))
  }

  return groups.map((group) => ({
    ...group,
    size: Math.round((group.size / totalSize) * 100),
  }))
}
