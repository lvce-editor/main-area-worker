import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SplitDirection } from '../MainAreaState/MainAreaState.ts'
import * as CloseTab from '../CloseTab/CloseTab.ts'
import * as FocusEditorGroup from '../FocusEditorGroup/FocusEditorGroup.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'
import * as SwitchTab from '../SwitchTab/SwitchTab.ts'

type MainAreaClickDataset = Record<string, string>

const parseId = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined
  }
  const parsedValue = Number.parseInt(value, 10)
  return Number.isNaN(parsedValue) ? undefined : parsedValue
}

const getTabLocation = (dataset: MainAreaClickDataset): { groupId: number; tabId: number } | undefined => {
  const groupId = parseId(dataset.groupId)
  const tabId = parseId(dataset.tabId)
  if (groupId === undefined || tabId === undefined) {
    return undefined
  }
  return { groupId, tabId }
}

const handleTabClick = (state: MainAreaState, dataset: MainAreaClickDataset): MainAreaState | undefined => {
  const location = getTabLocation(dataset)
  if (!location) {
    return undefined
  }
  return SwitchTab.switchTab(state, location.groupId, location.tabId)
}

const handleTabClose = (state: MainAreaState, dataset: MainAreaClickDataset): MainAreaState | undefined => {
  const location = getTabLocation(dataset)
  if (!location) {
    return undefined
  }
  return CloseTab.closeTab(state, location.groupId, location.tabId)
}

const handleGroupFocus = (state: MainAreaState, dataset: MainAreaClickDataset): MainAreaState | undefined => {
  const groupId = parseId(dataset.groupId)
  if (groupId === undefined) {
    return undefined
  }
  return FocusEditorGroup.focusEditorGroup(state, groupId)
}

const handleSplitAction = (state: MainAreaState, dataset: MainAreaClickDataset): MainAreaState | undefined => {
  const groupId = parseId(dataset.groupId)
  if (groupId === undefined || !dataset.action?.startsWith('split-')) {
    return undefined
  }
  const direction = dataset.action.replace('split-', '') as SplitDirection
  return SplitEditorGroup.splitEditorGroup(state, groupId, direction)
}

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

  if (dataset.tabId) {
    const nextState = handleTabClick(state, dataset)
    if (nextState) {
      return nextState
    }
  }

  if (dataset.action === 'close-tab' && dataset.tabId) {
    const nextState = handleTabClose(state, dataset)
    if (nextState) {
      return nextState
    }
  }

  if (dataset.groupId && !dataset.tabId) {
    const nextState = handleGroupFocus(state, dataset)
    if (nextState) {
      return nextState
    }
  }

  if (dataset.action?.startsWith('split-')) {
    const nextState = handleSplitAction(state, dataset)
    if (nextState) {
      return nextState
    }
  }

  return state
}
