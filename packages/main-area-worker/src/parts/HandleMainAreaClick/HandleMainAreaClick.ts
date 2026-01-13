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
      return SwitchTab.switchTab(state, groupId, dataset.tabId)
    }
  }

  // Handle tab close button
  if (dataset.action === 'close-tab' && dataset.tabId) {
    const { groupId } = dataset
    if (groupId) {
      return CloseTab.closeTab(state, groupId, dataset.tabId)
    }
  }

  // Handle editor group focus
  if (dataset.groupId && !dataset.tabId) {
    return FocusEditorGroup.focusEditorGroup(state, dataset.groupId)
  }

  // Handle split actions
  if (dataset.action?.startsWith('split-')) {
    const { groupId } = dataset
    if (groupId) {
      const direction = dataset.action.replace('split-', '') as SplitDirection
      return SplitEditorGroup.splitEditorGroup(state, groupId, direction)
    }
  }

  return state
}
