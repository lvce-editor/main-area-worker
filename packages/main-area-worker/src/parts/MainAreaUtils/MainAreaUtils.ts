import type { MainAreaState, EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'

export const isValidTab = (tab: any): tab is Tab => {
  return (
    tab &&
    typeof tab.id === 'number' &&
    typeof tab.title === 'string' &&
    typeof tab.content === 'string' &&
    typeof tab.isDirty === 'boolean' &&
    (tab.editorType === 'text' || tab.editorType === 'custom') &&
    (tab.editorType !== 'custom' || typeof tab.customEditorId === 'string')
  )
}

export const isValidEditorGroup = (group: any): group is EditorGroup => {
  return (
    group &&
    typeof group.id === 'number' &&
    Array.isArray(group.tabs) &&
    group.tabs.every(isValidTab) &&
    (group.activeTabId === undefined || typeof group.activeTabId === 'number') &&
    typeof group.focused === 'boolean' &&
    typeof group.size === 'number' &&
    group.size > 0
  )
}

export const findGroupById = (state: MainAreaState, groupId: number | string): EditorGroup | undefined => {
  return state.layout.groups.find((group) => group.id === groupId)
}

export const findTabById = (state: MainAreaState, tabId: number | string): { tab: Tab; groupId: number | string } | undefined => {
  for (const group of state.layout.groups) {
    const tab = group.tabs.find((t) => t.id === tabId)
    if (tab) {
      return { groupId: group.id, tab }
    }
  }
  return undefined
}

export const getActiveTab = (state: MainAreaState): { tab: Tab; groupId: number | string } | undefined => {
  const activeGroup = state.layout.groups.find((group) => group.focused)
  if (!activeGroup || !activeGroup.activeTabId) {
    return undefined
  }

  const activeTab = activeGroup.tabs.find((tab) => tab.id === activeGroup.activeTabId)
  if (!activeTab) {
    return undefined
  }

  return { groupId: activeGroup.id, tab: activeTab }
}

export const getAllTabs = (state: MainAreaState): Tab[] => {
  return state.layout.groups.flatMap((group) => group.tabs)
}

export const getDirtyTabs = (state: MainAreaState): Tab[] => {
  return getAllTabs(state).filter((tab) => tab.isDirty)
}

export const hasDirtyTabs = (state: MainAreaState): boolean => {
  return getDirtyTabs(state).length > 0
}

export const getGroupIndex = (state: MainAreaState, groupId: number | string): number => {
  return state.layout.groups.findIndex((group) => group.id === groupId)
}

export const getTabIndex = (group: EditorGroup, tabId: number): number => {
  return group.tabs.findIndex((tab) => tab.id === tabId)
}

export const normalizeGroupSizes = (groups: readonly EditorGroup[]): EditorGroup[] => {
  const totalSize = groups.reduce((sum, group) => sum + group.size, 0)
  if (totalSize === 0) {
    return groups.map((group) => ({ ...group, size: Math.round(100 / groups.length) }))
  }

  return groups.map((group) => ({
    ...group,
    size: Math.round((group.size / totalSize) * 100),
  }))
}

export const validateMainAreaState = (state: any): state is MainAreaState => {
  return (
    state &&
    typeof state.assetDir === 'string' &&
    typeof state.platform === 'number' &&
    state.layout &&
    Array.isArray(state.layout.groups) &&
    state.layout.groups.every(isValidEditorGroup) &&
    (state.layout.activeGroupId === undefined || typeof state.layout.activeGroupId === 'number') &&
    (state.layout.direction === 'horizontal' || state.layout.direction === 'vertical') &&
    typeof state.uid === 'number'
  )
}
