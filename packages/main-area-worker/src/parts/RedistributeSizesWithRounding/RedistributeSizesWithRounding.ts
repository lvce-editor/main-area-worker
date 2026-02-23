import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'

export const redistributeSizesWithRounding = (groups: readonly EditorGroup[]): EditorGroup[] => {
  return groups.map((group) => ({
    ...group,
    size: Math.round(100 / groups.length),
  }))
}
