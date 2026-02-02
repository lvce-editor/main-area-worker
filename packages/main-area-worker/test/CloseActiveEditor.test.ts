import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeActiveEditor } from '../src/parts/CloseActiveEditor/CloseActiveEditor.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeActiveEditor should close the active tab in focused group', () => {
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

  const result = closeActiveEditor(state)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 2,
        focused: true,
        id: 1,
        isEmpty: false,
        size: 100,
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
  }

  expect(result.layout).toEqual(expectedLayout)
})

test('closeActiveEditor should return same state when no focused group', () => {
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

  const result = closeActiveEditor(state)

  expect(result).toBe(state)
})

test('closeActiveEditor should return same state when no active tab in focused group', () => {
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
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = closeActiveEditor(state)

  expect(result).toBe(state)
})

test('closeActiveEditor should return same state when no groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }

  const result = closeActiveEditor(state)

  expect(result).toBe(state)
})

test('closeActiveEditor should remove group when closing the last tab in focused group', () => {
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

  const result = closeActiveEditor(state)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('closeActiveEditor should close active tab in focused group when multiple groups exist', () => {
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
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
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

  const result = closeActiveEditor(state)

  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[1].tabs).toHaveLength(1)
  expect(result.layout.groups[1].tabs[0].id).toBe(3)
})

test('closeActiveEditor should remove group when closing last tab with multiple groups', () => {
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

  const result = closeActiveEditor(state)

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].id).toBe(2)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.activeGroupId).toBe(2)
})
