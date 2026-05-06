import { expect, test } from '@jest/globals'
import type { MainAreaLayout, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { getUpdatedGroups } from '../src/parts/SelectTab/GetUpdatedGroups/GetUpdatedGroups.ts'

const createTab = (id: number, overrides: Partial<Tab> = {}): Tab => {
  return {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id,
    isDirty: false,
    isPreview: false,
    title: `File ${id}`,
    ...overrides,
  }
}

test('getUpdatedGroups should focus selected group and update active tab', () => {
  const groups: MainAreaLayout['groups'] = [
    {
      activeTabId: 1,
      focused: true,
      id: 1,
      isEmpty: false,
      size: 50,
      tabs: [createTab(1), createTab(2)],
    },
    {
      activeTabId: 3,
      focused: false,
      id: 2,
      isEmpty: false,
      size: 50,
      tabs: [createTab(3)],
    },
  ]

  expect(getUpdatedGroups(groups, 1, false, 3)).toEqual([
    {
      activeTabId: 1,
      focused: false,
      id: 1,
      isEmpty: false,
      size: 50,
      tabs: [createTab(1), createTab(2)],
    },
    {
      activeTabId: 3,
      focused: true,
      id: 2,
      isEmpty: false,
      size: 50,
      tabs: [createTab(3)],
    },
  ])
})

test('getUpdatedGroups should reset loading state and error message for selected tab when loading starts', () => {
  const groups: MainAreaLayout['groups'] = [
    {
      activeTabId: 1,
      focused: true,
      id: 1,
      isEmpty: false,
      size: 100,
      tabs: [createTab(1, { errorMessage: 'failure', loadingState: 'error' }), createTab(2)],
    },
  ]

  expect(getUpdatedGroups(groups, 0, true, 1)).toEqual([
    {
      activeTabId: 1,
      focused: true,
      id: 1,
      isEmpty: false,
      size: 100,
      tabs: [createTab(1, { errorMessage: '', loadingState: 'loading' }), createTab(2)],
    },
  ])
})
