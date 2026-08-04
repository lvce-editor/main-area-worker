import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import { isValidTab } from '../IsValidTab/IsValidTab.ts'
import { isLayoutDirection } from '../LayoutDirection/LayoutDirection.ts'

export const isValidEditorGroup = (group: any): group is EditorGroup => {
  return (
    group &&
    typeof group.id === 'number' &&
    Array.isArray(group.tabs) &&
    group.tabs.every(isValidTab) &&
    typeof group.activeTabId === 'number' &&
    isLayoutDirection(group.direction) &&
    typeof group.focused === 'boolean' &&
    (group.segmentId === undefined || typeof group.segmentId === 'number') &&
    typeof group.size === 'number' &&
    group.size > 0 &&
    typeof group.isEmpty === 'boolean'
  )
}
