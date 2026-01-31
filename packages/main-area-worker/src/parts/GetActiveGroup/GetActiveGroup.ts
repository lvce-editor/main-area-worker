import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'

const getActiveGroup = (groups: readonly EditorGroup[], activeGroupId: number): EditorGroup | undefined => {
  return groups.find((g) => g.id === activeGroupId)
}

export { getActiveGroup as GetActiveGroup }
