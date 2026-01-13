import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SplitDirection } from '../MainAreaState/MainAreaState.ts'
import * as CloseTab from '../CloseTab/CloseTab.ts'
import * as FocusEditorGroup from '../FocusEditorGroup/FocusEditorGroup.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'
import * as SwitchTab from '../SwitchTab/SwitchTab.ts'

export const handleMainAreaKeyboard = (
  state: MainAreaState,
  event: {
    key: string
    ctrlKey?: boolean
    metaKey?: boolean
    shiftKey?: boolean
  },
): MainAreaState => {
  const { ctrlKey = false, key, metaKey = false, shiftKey = false } = event
  const isCtrl = ctrlKey || metaKey

  const activeGroup = state.layout.groups.find((group) => group.focused)
  if (!activeGroup) {
    return state
  }

  // Tab navigation
  if (key === 'Tab' && isCtrl) {
    const groupIndex = state.layout.groups.findIndex((group) => group.id === activeGroup.id)
    const nextGroupIndex = shiftKey
      ? (groupIndex - 1 + state.layout.groups.length) % state.layout.groups.length
      : (groupIndex + 1) % state.layout.groups.length
    const nextGroup = state.layout.groups[nextGroupIndex]
    return FocusEditorGroup.focusEditorGroup(state, nextGroup.id)
  }

  // Switch between tabs within group
  if (key === 'ArrowLeft' && isCtrl && !shiftKey) {
    const activeTabIndex = activeGroup.tabs.findIndex((tab) => tab.id === activeGroup.activeTabId)
    if (activeTabIndex > 0) {
      const prevTab = activeGroup.tabs[activeTabIndex - 1]
      return SwitchTab.switchTab(state, activeGroup.id, prevTab.id)
    }
  }

  if (key === 'ArrowRight' && isCtrl && !shiftKey) {
    const activeTabIndex = activeGroup.tabs.findIndex((tab) => tab.id === activeGroup.activeTabId)
    if (activeTabIndex < activeGroup.tabs.length - 1) {
      const nextTab = activeGroup.tabs[activeTabIndex + 1]
      return SwitchTab.switchTab(state, activeGroup.id, nextTab.id)
    }
  }

  // Close current tab
  if (key === 'w' && isCtrl && activeGroup.activeTabId) {
    return CloseTab.closeTab(state, activeGroup.id, activeGroup.activeTabId)
  }

  // Split editor
  if (key === '\\' && isCtrl) {
    const direction: SplitDirection = shiftKey ? 'down' : 'right'
    return SplitEditorGroup.splitEditorGroup(state, activeGroup.id, direction)
  }

  return state
}
