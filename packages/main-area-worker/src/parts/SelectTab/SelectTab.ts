import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import * as GetNextRequestId from '../GetNextRequestId/GetNextRequestId.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import { shouldLoadContentForTab } from '../ShouldLoadContentForTab/ShouldLoadContentForTab.ts'
import { startContentLoading } from '../StartContentLoading/StartContentLoading.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

interface SelectedTabData {
  group: MainAreaState['layout']['groups'][number]
  groupId: number
  tab: Tab
  tabId: number
}

const getActiveTabId = (state: MainAreaState): number | undefined => {
  const { layout } = state
  const { activeGroupId, groups } = layout
  const activeGroup = groups.find((g) => g.id === activeGroupId)
  return activeGroup?.activeTabId
}

const getSelectedTabData = (state: MainAreaState, groupIndex: number, index: number): SelectedTabData | undefined => {
  const group = state.layout.groups[groupIndex]
  if (!group || index < 0 || index >= group.tabs.length) {
    return undefined
  }
  const tab = group.tabs[index]
  return {
    group,
    groupId: group.id,
    tab,
    tabId: tab.id,
  }
}

const getUpdatedGroups = (
  groups: readonly MainAreaState['layout']['groups'][number][],
  groupIndex: number,
  needsLoading: boolean,
  tabId: number,
): MainAreaState['layout']['groups'] => {
  return groups.map((group, index) => {
    if (index !== groupIndex) {
      return {
        ...group,
        focused: false,
      }
    }

    const tabs = needsLoading
      ? group.tabs.map((tab): Tab => {
          if (tab.id !== tabId) {
            return tab
          }
          return {
            ...tab,
            errorMessage: '',
            loadingState: 'loading',
          }
        })
      : group.tabs

    return {
      ...group,
      activeTabId: tabId,
      focused: true,
      tabs,
    }
  })
}

const shouldCreateViewletForSelectedTab = (tab: Tab): boolean => {
  return Boolean(tab.uri) && (tab.editorUid === -1 || !tab.loadingState || tab.loadingState === 'loading')
}

const getSelectedTabBounds = (state: MainAreaState) => {
  return {
    height: state.height - state.tabHeight,
    width: state.width,
    x: state.x,
    y: state.y + state.tabHeight,
  }
}

const getViewletModuleId = async (tab: Tab): Promise<string | undefined> => {
  return tab.editorInput ? getViewletModuleIdForEditorInput(tab.editorInput) : RendererWorker.invoke('Layout.getModuleId', tab.uri)
}

const maybeStartLoading = async (
  state: MainAreaState,
  newState: MainAreaState,
  tabId: number,
  tab: Tab,
  needsLoading: boolean,
  requestId: number,
): Promise<MainAreaState> => {
  if (needsLoading && tab.uri) {
    return startContentLoading(state, newState, tabId, tab.uri, requestId)
  }
  return newState
}

const maybeCreateViewletForSelectedTab = async (
  state: MainAreaState,
  newState: MainAreaState,
  groupIndex: number,
  index: number,
  tabId: number,
  tab: Tab,
  uid: number,
  needsLoading: boolean,
  requestId: number,
  switchCommands: readonly any[],
): Promise<MainAreaState | undefined> => {
  const selectedTab = newState.layout.groups[groupIndex].tabs[index]
  if (!shouldCreateViewletForSelectedTab(selectedTab)) {
    return undefined
  }

  const viewletModuleId = await getViewletModuleId(selectedTab)
  if (!viewletModuleId) {
    return undefined
  }

  const bounds = getSelectedTabBounds(newState)
  let stateWithViewlet = ViewletLifecycle.createViewletForTab(newState, tabId, viewletModuleId, bounds)
  MainAreaStates.set(uid, state, stateWithViewlet)

  if (switchCommands.length > 0) {
    await ExecuteViewletCommands.executeViewletCommands(switchCommands)
  }

  const tabWithViewlet = findTabById(stateWithViewlet, tabId)
  if (tabWithViewlet) {
    const { editorUid } = tabWithViewlet.tab
    if (editorUid !== -1 && selectedTab.uri) {
      await createViewlet(viewletModuleId, editorUid, tabId, bounds, selectedTab.uri)
      stateWithViewlet = ViewletLifecycle.handleViewletReady(stateWithViewlet, editorUid)
      MainAreaStates.set(uid, state, stateWithViewlet)
    }
  }

  return maybeStartLoading(state, stateWithViewlet, tabId, tab, needsLoading, requestId)
}

export const selectTab = async (state: MainAreaState, groupIndex: number, index: number): Promise<MainAreaState> => {
  const { layout, uid } = state
  const { groups } = layout

  if (groupIndex < 0 || groupIndex >= groups.length) {
    return state
  }

  const selectedTabData = getSelectedTabData(state, groupIndex, index)
  if (!selectedTabData) {
    return state
  }

  const { group, groupId, tab, tabId } = selectedTabData
  const isAlreadyActive = layout.activeGroupId === groupId && group.activeTabId === tabId

  if (isAlreadyActive && !shouldLoadContentForTab(tab)) {
    return state
  }

  const previousTabId = getActiveTabId(state)
  const needsLoading = shouldLoadContentForTab(tab)
  const requestId = needsLoading ? GetNextRequestId.getNextRequestId() : 0
  const updatedGroups = getUpdatedGroups(groups, groupIndex, needsLoading, tabId)

  let newState: MainAreaState = {
    ...state,
    layout: {
      ...layout,
      activeGroupId: groupId,
      groups: updatedGroups,
    },
  }

  const { commands: switchCommands, newState: stateWithViewlet } = ViewletLifecycle.switchViewlet(newState, previousTabId, tabId)
  newState = stateWithViewlet

  const maybeCreatedState = await maybeCreateViewletForSelectedTab(
    state,
    newState,
    groupIndex,
    index,
    tabId,
    tab,
    uid,
    needsLoading,
    requestId,
    switchCommands,
  )
  if (maybeCreatedState) {
    return maybeCreatedState
  }

  MainAreaStates.set(uid, state, newState)

  if (switchCommands.length > 0) {
    await ExecuteViewletCommands.executeViewletCommands(switchCommands)
  }

  return maybeStartLoading(state, newState, tabId, tab, needsLoading, requestId)
}
