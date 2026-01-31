import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeFocusedTab } from '../src/parts/CloseFocusedTab/CloseFocusedTab.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeFocusedTab should close the focused tab', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeFocusedTab(state)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 2,
        focused: true,
        id: 1,
        isEmpty: false,
        size: 100,
        tabs: [
          {
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            title: 'File 2',
          },
        ],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
  expect(result).not.toBe(state)
})

test('closeFocusedTab should return same state when no focused group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeFocusedTab(state)

  expect(result).toBe(state)
})

test('closeFocusedTab should return same state when no active tab in focused group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeFocusedTab(state)

  expect(result).toBe(state)
})

test('closeFocusedTab should return same state when no groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }

  const result = closeFocusedTab(state)

  expect(result).toBe(state)
})

test('closeFocusedTab should remove group when closing the last tab in focused group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeFocusedTab(state)

  const expectedLayout = {
    activeGroupId: undefined,
    direction: 'horizontal' as const,
    groups: [],
  }

  expect(result.layout).toEqual(expectedLayout)
  expect(result).not.toBe(state)
})

test('closeFocusedTab should close tab in focused group when multiple groups exist', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeFocusedTab(state)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 1,
        focused: false,
        id: 1,
        isEmpty: false,
        size: 50,
        tabs: [
          {
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File 1',
          },
        ],
      },
      {
        activeTabId: 3,
        focused: true,
        id: 2,
        isEmpty: false,
        size: 50,
        tabs: [
          {
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 3,
            isDirty: false,
            title: 'File 3',
          },
        ],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
  expect(result).not.toBe(state)
})

test('closeFocusedTab should remove group when closing last tab with multiple groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeFocusedTab(state)

  const expectedLayout = {
    activeGroupId: 2,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 2,
        focused: false,
        id: 1,
        isEmpty: false,
        size: 100,
        tabs: [
          {
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            title: 'File 2',
          },
        ],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
  expect(result).not.toBe(state)
})
