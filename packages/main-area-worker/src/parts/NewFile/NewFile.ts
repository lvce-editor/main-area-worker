import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import * as Id from '../Id/Id.ts'
import { openTab } from '../OpenTab/OpenTab.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'

export const newFile = (state: MainAreaState): MainAreaState => {
  Assert.object(state)

  const { uid } = state
  const { layout } = state
  const { activeGroupId, groups } = layout

  // Find the active group
  let activeGroup = activeGroupId === undefined ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)

  // If no active group exists, create one with an empty group first
  let newState = state
  if (!activeGroup) {
    const emptyGroupState = ensureActiveGroup(state, '')
    newState = emptyGroupState
    activeGroup = newState.layout.groups.find((group) => group.id === newState.layout.activeGroupId)
  }

  if (!activeGroup) {
    return state
  }

  // Create a new empty tab
  const tabId = Id.create()
  const newTab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: '',
    icon: '',
    id: tabId,
    isDirty: false,
    language: 'plaintext',
    loadingState: 'idle',
    title: 'Untitled',
  }

  const stateWithNewTab = openTab(newState, activeGroup.id, newTab)
  set(uid, state, stateWithNewTab)

  return stateWithNewTab
}
