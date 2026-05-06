import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SwitchTab from '../src/parts/SwitchTab/SwitchTab.ts'

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

test('switchTab should return state unchanged when group does not exist', () => {
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

  const result = SwitchTab.switchTab(state, 999, 1)

  expect(result.layout).toEqual(state.layout)
})

test('switchTab should return state unchanged when tab does not exist in group', () => {
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
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts')],
        },
      ],
    },
  }

  const result = SwitchTab.switchTab(state, 1, 999)

  expect(result.layout).toEqual(state.layout)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('switchTab should change active tab in group', () => {
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
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts')],
        },
      ],
    },
  }

  const result = SwitchTab.switchTab(state, 1, 2)

  expect(result.layout.groups[0].activeTabId).toBe(2)
})

test('switchTab should switch to third tab', () => {
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
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts'), createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  const result = SwitchTab.switchTab(state, 1, 3)

  expect(result.layout.groups[0].activeTabId).toBe(3)
})

test('switchTab should not affect other groups', () => {
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
          size: 50,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts')],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(3, 'file3.ts'), createTab(4, 'file4.ts')],
        },
      ],
    },
  }

  const result = SwitchTab.switchTab(state, 1, 2)

  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[1].activeTabId).toBe(3)
})
