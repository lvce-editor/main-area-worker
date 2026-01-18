import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SplitDirection } from '../MainAreaState/MainAreaState.ts'
import * as CloseTab from '../CloseTab/CloseTab.ts'
import * as FocusEditorGroup from '../FocusEditorGroup/FocusEditorGroup.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'
import * as SwitchTab from '../SwitchTab/SwitchTab.ts'

export const handleMainAreaClick = (
  state: MainAreaState,
  event: {
    target: {
      classList?: string[]
      dataset?: Record<string, string>
    }
  },
): MainAreaState => {
  const { target } = event
  if (!target.dataset) {
    return state
  }

  const { dataset } = target

  // Handle tab click
  if (dataset.tabId) {
    const { groupId } = dataset
    if (groupId) {
      const parsedGroupId = Number.parseInt(groupId, 10)
      const parsedTabId = Number.parseInt(dataset.tabId, 10)
      if (!Number.isNaN(parsedGroupId) && !Number.isNaN(parsedTabId)) {
        return SwitchTab.switchTab(state, parsedGroupId, parsedTabId)
      }
    }
  }

  // Handle tab close button
  if (dataset.action === 'close-tab' && dataset.tabId) {
    const { groupId } = dataset
    if (groupId) {
      const parsedGroupId = Number.parseInt(groupId, 10)
      const parsedTabId = Number.parseInt(dataset.tabId, 10)
      if (!Number.isNaN(parsedGroupId) && !Number.isNaN(parsedTabId)) {
        return CloseTab.closeTab(state, parsedGroupId, parsedTabId)
      }
    }
  }

  // Handle editor group focus
  if (dataset.groupId && !dataset.tabId) {
    const parsedGroupId = Number.parseInt(dataset.groupId, 10)
    if (!Number.isNaN(parsedGroupId)) {
      return FocusEditorGroup.focusEditorGroup(state, parsedGroupId)
    }
  }

  // Handle split actions
  if (dataset.action?.startsWith('split-')) {
    const { groupId } = dataset
    if (groupId) {
      const parsedGroupId = Number.parseInt(groupId, 10)
      if (!Number.isNaN(parsedGroupId)) {
        const direction = dataset.action.replace('split-', '') as SplitDirection
        return SplitEditorGroup.splitEditorGroup(state, parsedGroupId, direction)
      }
    }
  }

  return state
}
