/* eslint-disable prefer-destructuring */
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import * as Id from '../Id/Id.ts'
import { openTab } from '../OpenTab/OpenTab.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'

export const openUri = async (state: MainAreaState, options: OpenUriOptions | string): Promise<MainAreaState> => {
  Assert.object(state)

  let uri = ''
  if (typeof options === 'string') {
    uri = options
  } else {
    uri = options.uri
  }

  // Check if a tab with this URI already exists
  const existingTab = findTabByUri(state, uri)
  if (existingTab) {
    // Tab exists, switch to it and focus its group
    const focusedState = focusEditorGroup(state, existingTab.groupId)
    return switchTab(focusedState, existingTab.groupId, existingTab.tab.id)
  }

  // Find the active group (by activeGroupId or focused flag)
  const { layout } = state
  const { activeGroupId, groups } = layout
  const activeGroup = activeGroupId === undefined ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)

  // If no active group exists, create one
  if (!activeGroup) {
    const groupId = Id.create()
    const title = PathDisplay.getLabel(uri)
    const newTab = {
      content: '',
      editorType: 'text' as const,
      id: Id.create(),
      isDirty: false,
      path: uri,
      title,
    }
    const newGroup = {
      activeTabId: newTab.id,
      focused: true,
      id: groupId,
      size: 100,
      tabs: [newTab],
    }

    return {
      ...state,
      layout: {
        ...layout,
        activeGroupId: groupId,
        groups: [...groups, newGroup],
      },
    }
  }

  // Create a new tab with the URI in the active group
  const title = PathDisplay.getLabel(uri)
  const newTab = {
    content: '',
    editorType: 'text' as const,
    isDirty: false,
    path: uri,
    title,
  }

  return openTab(state, activeGroup.id, newTab)
}
