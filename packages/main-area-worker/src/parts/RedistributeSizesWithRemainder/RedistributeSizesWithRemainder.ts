import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'

export const redistributeSizesWithRemainder = (groups: readonly EditorGroup[]): EditorGroup[] => {
  const baseSize = Math.floor(100 / groups.length)
  const remainder = 100 % groups.length

  return groups.map((group, index) => ({
    ...group,
    size: baseSize + (index === groups.length - 1 ? remainder : 0),
  }))
}
