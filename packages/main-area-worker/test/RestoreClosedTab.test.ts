import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RestoreClosedTab from '../src/parts/RestoreClosedTab/RestoreClosedTab.ts'

const createTab = (id: number, title: string): Tab => {
  return {
    editorType: 'text',
    editorUid: id,
    icon: '',
    id,
    isDirty: false,
    isPreview: false,
    title,
  }
}

test('restoreClosedTab should return state unchanged when there are no closed tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = await RestoreClosedTab.restoreClosedTab(state)

  expect(result).toBe(state)
})

test('restoreClosedTab should restore closed tab', async () => {
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
          tabs: [createTab(1, 'file1.ts')],
        },
        groupIndex: 0,
        tab: createTab(2, 'file2.ts'),
        tabIndex: 1,
      },
    ],
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = await RestoreClosedTab.restoreClosedTab(state)

  expect(result.closedTabs).toHaveLength(0)
  expect(result.layout.groups[0].tabs).toHaveLength(2)
})

test('restoreClosedTab should add restored tab back to the group', async () => {
  const closedTab = createTab(2, 'file2.ts')
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
          tabs: [createTab(1, 'file1.ts')],
        },
        groupIndex: 0,
        tab: closedTab,
        tabIndex: 1,
      },
    ],
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = await RestoreClosedTab.restoreClosedTab(state)

  expect(result.layout.groups[0].tabs[1].id).toBe(2)
  expect(result.layout.groups[0].tabs[1].title).toBe('file2.ts')
})

test('restoreClosedTab should set restored tab as active', async () => {
  const closedTab = createTab(2, 'file2.ts')
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
          tabs: [createTab(1, 'file1.ts')],
        },
        groupIndex: 0,
        tab: closedTab,
        tabIndex: 1,
      },
    ],
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = await RestoreClosedTab.restoreClosedTab(state)

  expect(result.layout.groups[0].activeTabId).toBe(2)
})

test('restoreClosedTab should restore multiple closed tabs in reverse order', async () => {
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
          tabs: [createTab(1, 'file1.ts')],
        },
        groupIndex: 0,
        tab: createTab(2, 'file2.ts'),
        tabIndex: 1,
      },
      {
        group: {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
        groupIndex: 0,
        tab: createTab(3, 'file3.ts'),
        tabIndex: 2,
      },
    ],
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = await RestoreClosedTab.restoreClosedTab(state)

  expect(result.closedTabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(2)
  expect(result.layout.groups[0].activeTabId).toBe(3)
})
