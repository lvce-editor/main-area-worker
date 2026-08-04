import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { restoreClosedTab } from '../src/parts/RestoreClosedTab/RestoreClosedTab.ts'

const tab: Tab = {
  editorType: 'text',
  editorUid: 1,
  icon: '',
  id: 1,
  isDirty: false,
  isPreview: false,
  loadingState: 'loaded',
  title: 'file.ts',
  uri: '/file.ts',
}

test('restoreClosedTab returns unchanged state when the restore stack is empty', async () => {
  const state = createDefaultState()

  await expect(restoreClosedTab(state)).resolves.toBe(state)
})

test('restoreClosedTab focuses an already open tab from the restore stack', async () => {
  const group = {
    activeTabId: 1,
    direction: 1 as const,
    focused: true,
    id: 1,
    isEmpty: false,
    size: 100,
    tabs: [tab],
  }
  const state: MainAreaState = {
    ...createDefaultState(),
    closedTabs: [
      {
        group,
        groupIndex: 0,
        tab,
        tabIndex: 0,
      },
    ],
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [group],
    },
  }

  const result = await restoreClosedTab(state)

  expect(result.closedTabs).toEqual([])
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('restoreClosedTab preserves the rendered state for the next diff', async () => {
  const closedTab = {
    ...tab,
    editorUid: -1,
    uri: '',
  }
  const group = {
    activeTabId: 1,
    direction: 1 as const,
    focused: true,
    id: 1,
    isEmpty: false,
    size: 100,
    tabs: [closedTab],
  }
  const state: MainAreaState = {
    ...createDefaultState(),
    closedTabs: [
      {
        group,
        groupIndex: 0,
        tab: closedTab,
        tabIndex: 0,
      },
    ],
  }
  MainAreaStates.set(state.uid, state, state)

  const result = await restoreClosedTab(state)

  expect(MainAreaStates.get(state.uid).oldState).toBe(state)
  expect(MainAreaStates.get(state.uid).newState).toBe(result)
})
