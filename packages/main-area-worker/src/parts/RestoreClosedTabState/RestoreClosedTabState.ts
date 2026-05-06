import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import type { ClosedTabEntry, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { redistributeSizesWithRounding } from '../RedistributeSizesWithRounding/RedistributeSizesWithRounding.ts'

export interface RestoreClosedTabResult {
  readonly groupIndex: number
  readonly newState: MainAreaState
  readonly tabIndex: number
}

const focusGroup = (groups: readonly EditorGroup[], groupId: number, activeTabId: number): readonly EditorGroup[] => {
  return groups.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        activeTabId,
        focused: true,
      }
    }
    return {
      ...group,
      focused: false,
    }
  })
}

const clampIndex = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

const getRestoredTab = (tab: Tab): Tab => {
  return {
    ...tab,
    editorUid: -1,
    errorMessage: '',
    loadingState: undefined,
  }
}

const getStateWithoutLastClosedTab = (state: MainAreaState): MainAreaState => {
  return {
    ...state,
    closedTabs: state.closedTabs.slice(0, -1),
  }
}

const restoreExistingUri = (state: MainAreaState, entry: ClosedTabEntry): RestoreClosedTabResult | undefined => {
  if (!entry.tab.uri) {
    return undefined
  }

  const existing = findTabByUri(state, entry.tab.uri)
  if (!existing) {
    return undefined
  }

  const groupIndex = state.layout.groups.findIndex((group) => group.id === existing.groupId)
  if (groupIndex === -1) {
    return undefined
  }

  const tabIndex = state.layout.groups[groupIndex].tabs.findIndex((tab) => tab.id === existing.tab.id)
  if (tabIndex === -1) {
    return undefined
  }

  const newStateWithoutClosedTab = getStateWithoutLastClosedTab(state)
  const groups = focusGroup(newStateWithoutClosedTab.layout.groups, existing.groupId, existing.tab.id)

  return {
    groupIndex,
    newState: {
      ...newStateWithoutClosedTab,
      layout: {
        ...newStateWithoutClosedTab.layout,
        activeGroupId: existing.groupId,
        groups,
      },
    },
    tabIndex,
  }
}

const restoreIntoExistingGroup = (state: MainAreaState, entry: ClosedTabEntry): RestoreClosedTabResult | undefined => {
  const { groups } = state.layout
  const groupIndex = groups.findIndex((group) => group.id === entry.group.id)
  if (groupIndex === -1) {
    return undefined
  }

  const restoredTab = getRestoredTab(entry.tab)
  const group = groups[groupIndex]
  const tabIndex = clampIndex(entry.tabIndex, 0, group.tabs.length)
  const tabs = [...group.tabs]
  tabs.splice(tabIndex, 0, restoredTab)

  const newStateWithoutClosedTab = getStateWithoutLastClosedTab(state)
  const updatedGroups = groups.map((currentGroup, index) => {
    if (index === groupIndex) {
      return {
        ...currentGroup,
        activeTabId: restoredTab.id,
        focused: true,
        isEmpty: false,
        tabs,
      }
    }
    return {
      ...currentGroup,
      focused: false,
    }
  })

  return {
    groupIndex,
    newState: {
      ...newStateWithoutClosedTab,
      layout: {
        ...newStateWithoutClosedTab.layout,
        activeGroupId: group.id,
        groups: updatedGroups,
      },
    },
    tabIndex,
  }
}

const createRestoredGroup = (entry: ClosedTabEntry): EditorGroup => {
  return {
    ...entry.group,
    activeTabId: entry.tab.id,
    focused: true,
    isEmpty: false,
    tabs: [getRestoredTab(entry.tab)],
  }
}

const restoreIntoRecreatedGroup = (state: MainAreaState, entry: ClosedTabEntry): RestoreClosedTabResult => {
  const newStateWithoutClosedTab = getStateWithoutLastClosedTab(state)
  const restoredGroup = createRestoredGroup(entry)
  const { groups } = newStateWithoutClosedTab.layout

  if (groups.length === 0) {
    return {
      groupIndex: 0,
      newState: {
        ...newStateWithoutClosedTab,
        layout: {
          ...newStateWithoutClosedTab.layout,
          activeGroupId: restoredGroup.id,
          groups: [restoredGroup],
        },
      },
      tabIndex: 0,
    }
  }

  const groupIndex = clampIndex(entry.groupIndex, 0, groups.length)
  const unfocusedGroups = groups.map((group) => ({
    ...group,
    focused: false,
  }))
  const insertedGroups = [...unfocusedGroups.slice(0, groupIndex), restoredGroup, ...unfocusedGroups.slice(groupIndex)]

  return {
    groupIndex,
    newState: {
      ...newStateWithoutClosedTab,
      layout: {
        ...newStateWithoutClosedTab.layout,
        activeGroupId: restoredGroup.id,
        groups: redistributeSizesWithRounding(insertedGroups),
      },
    },
    tabIndex: 0,
  }
}

export const restoreClosedTabState = (state: MainAreaState): RestoreClosedTabResult | undefined => {
  const entry = state.closedTabs.at(-1)
  if (!entry) {
    return undefined
  }

  return restoreExistingUri(state, entry) || restoreIntoExistingGroup(state, entry) || restoreIntoRecreatedGroup(state, entry)
}
