import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'

// Counter for request IDs to handle race conditions
let requestIdCounter = 0

export const getNextRequestId = (): number => {
  return ++requestIdCounter
}

export const updateTab = (state: MainAreaState, tabId: number, updates: Partial<Tab>): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const updatedGroups = groups.map((group) => {
    const tabIndex = group.tabs.findIndex((t) => t.id === tabId)
    if (tabIndex === -1) {
      return group
    }
    const updatedTabs = group.tabs.map((tab, index) => {
      if (index === tabIndex) {
        return { ...tab, ...updates }
      }
      return tab
    })
    return { ...group, tabs: updatedTabs }
  })
  return {
    ...state,
    layout: {
      ...layout,
      groups: updatedGroups,
    },
  }
}

export const findTab = (state: MainAreaState, tabId: number): Tab | undefined => {
  const { layout } = state
  const { groups } = layout
  for (const group of groups) {
    const tab = group.tabs.find((t) => t.id === tabId)
    if (tab) {
      return tab
    }
  }
  return undefined
}

export const loadFileContent = async (path: string): Promise<string> => {
  // @ts-ignore
  const content = await RendererWorker.invoke(ExtensionHostCommandType.FileSystemReadFile, path)
  return content
}

export const loadTabContentAsync = async (
  tabId: number,
  path: string,
  requestId: number,
  getLatestState: () => MainAreaState
): Promise<MainAreaState> => {
  try {
    const content = await loadFileContent(path)

    // Check for race condition: get the latest state and verify the request ID
    const latestState = getLatestState()
    const latestTab = findTab(latestState, tabId)

    // If the tab no longer exists or a newer request was started, discard this result
    if (!latestTab || latestTab.loadRequestId !== requestId) {
      return latestState
    }

    return updateTab(latestState, tabId, {
      content,
      errorMessage: undefined,
      loadingState: 'loaded',
    })
  } catch (error) {
    // Check for race condition before updating with error
    const latestState = getLatestState()
    const latestTab = findTab(latestState, tabId)

    if (!latestTab || latestTab.loadRequestId !== requestId) {
      return latestState
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to load file content'
    return updateTab(latestState, tabId, {
      content: '',
      errorMessage,
      loadingState: 'error',
    })
  }
}

// For testing: reset the request ID counter
export const resetRequestIdCounter = (): void => {
  requestIdCounter = 0
}
