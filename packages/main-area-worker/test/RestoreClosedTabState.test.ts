import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeTab } from '../src/parts/CloseTab/CloseTab.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { restoreClosedTabState } from '../src/parts/RestoreClosedTabState/RestoreClosedTabState.ts'

const createTab = (id: number, title: string, uri: string): Tab => {
  return {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id,
    isDirty: false,
    isPreview: false,
    title,
    uri,
  }
}

test('restoreClosedTabState should return undefined when there are no closed tabs', () => {
  const state = createDefaultState()

  const result = restoreClosedTabState(state)

  expect(result).toBeUndefined()
})

test('closeTab should add closed tab to the restore stack', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file-1.ts', '/tmp/file-1.ts'), createTab(2, 'file-2.ts', '/tmp/file-2.ts'), createTab(3, 'file-3.ts', '/tmp/file-3.ts')],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.closedTabs).toHaveLength(1)
  expect(result.closedTabs[0].group.id).toBe(1)
  expect(result.closedTabs[0].groupIndex).toBe(0)
  expect(result.closedTabs[0].tab.id).toBe(2)
  expect(result.closedTabs[0].tabIndex).toBe(1)
})

test('restoreClosedTabState should restore the most recently closed tab at its original index', () => {
  const initialState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file-1.ts', '/tmp/file-1.ts'), createTab(2, 'file-2.ts', '/tmp/file-2.ts'), createTab(3, 'file-3.ts', '/tmp/file-3.ts')],
        },
      ],
    },
  }
  const closedState = closeTab(initialState, 1, 2)

  const result = restoreClosedTabState(closedState)

  expect(result).toBeDefined()
  expect(result?.groupIndex).toBe(0)
  expect(result?.tabIndex).toBe(1)
  expect(result?.newState.closedTabs).toHaveLength(0)
  expect(result?.newState.layout.activeGroupId).toBe(1)
  expect(result?.newState.layout.groups[0].activeTabId).toBe(2)
  expect(result?.newState.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([1, 2, 3])
  expect(result?.newState.layout.groups[0].tabs[1].editorUid).toBe(-1)
})

test('restoreClosedTabState should restore closed tabs in LIFO order across groups', () => {
  const initialState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'left.ts', '/tmp/left.ts')],
        },
        {
          activeTabId: 3,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(2, 'middle.ts', '/tmp/middle.ts'), createTab(3, 'right.ts', '/tmp/right.ts')],
        },
      ],
    },
  }
  const afterFirstClose = closeTab(initialState, 1, 1)
  const afterSecondClose = closeTab(afterFirstClose, 2, 3)

  const firstRestore = restoreClosedTabState(afterSecondClose)
  const secondRestore = restoreClosedTabState(firstRestore!.newState)

  expect(firstRestore?.newState.layout.groups).toHaveLength(1)
  expect(firstRestore?.newState.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([2, 3])
  expect(firstRestore?.newState.layout.activeGroupId).toBe(2)
  expect(secondRestore?.newState.layout.groups.map((group) => group.id)).toEqual([1, 2])
  expect(secondRestore?.newState.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([1])
  expect(secondRestore?.newState.closedTabs).toHaveLength(0)
})

test('restoreClosedTabState should recreate a removed group at its original position', () => {
  const initialState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 34,
          tabs: [createTab(1, 'left.ts', '/tmp/left.ts')],
        },
        {
          activeTabId: 2,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 33,
          tabs: [createTab(2, 'middle.ts', '/tmp/middle.ts')],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 3,
          isEmpty: false,
          size: 33,
          tabs: [createTab(3, 'right.ts', '/tmp/right.ts')],
        },
      ],
    },
  }
  const closedState = closeTab(initialState, 2, 2)

  const result = restoreClosedTabState(closedState)

  expect(result).toBeDefined()
  expect(result?.newState.layout.groups).toHaveLength(3)
  expect(result?.newState.layout.groups.map((group) => group.id)).toEqual([1, 2, 3])
  expect(result?.groupIndex).toBe(1)
  expect(result?.tabIndex).toBe(0)
  expect(result?.newState.layout.groups[1].tabs.map((tab) => tab.id)).toEqual([2])
  expect(result?.newState.layout.activeGroupId).toBe(2)
})

test('restoreClosedTabState should focus an existing tab instead of restoring a duplicate uri', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    closedTabs: [
      {
        group: {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'shared.ts', '/tmp/shared.ts')],
        },
        groupIndex: 0,
        tab: createTab(1, 'shared.ts', '/tmp/shared.ts'),
        tabIndex: 0,
      },
    ],
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 100,
          tabs: [createTab(2, 'shared.ts', '/tmp/shared.ts')],
        },
      ],
    },
  }

  const result = restoreClosedTabState(state)

  expect(result).toBeDefined()
  expect(result?.newState.layout.groups).toHaveLength(1)
  expect(result?.newState.layout.groups[0].tabs).toHaveLength(1)
  expect(result?.groupIndex).toBe(0)
  expect(result?.tabIndex).toBe(0)
  expect(result?.newState.closedTabs).toHaveLength(0)
})