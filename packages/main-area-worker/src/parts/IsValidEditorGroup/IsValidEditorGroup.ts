import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import { isValidTab } from '../IsValidTab/IsValidTab.ts'
import { isLayoutDirection } from '../LayoutDirection/LayoutDirection.ts'

export const isValidEditorGroup = (group: any): group is EditorGroup => {
  return (
    group &&
    typeof group.id === 'number' &&
    Array.isArray(group.tabs) &&
    group.tabs.every(isValidTab) &&
    (group.activeTabId === undefined || typeof group.activeTabId === 'number') &&
    (group.direction === undefined || isLayoutDirection(group.direction)) &&
    typeof group.focused === 'boolean' &&
    typeof group.size === 'number' &&
    group.size > 0 &&
    typeof group.isEmpty === 'boolean'
  )
}
