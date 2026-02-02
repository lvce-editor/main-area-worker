import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getAllEditorUids } from '../src/parts/GetAllEditorUids/GetAllEditorUids.ts'

test('getAllEditorUids should return empty array when no groups exist', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
      groups: [],
    },
  }

  const result = getAllEditorUids(state)

  expect(result).toEqual([])
})

test('getAllEditorUids should return empty array when groups have no tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 0,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = getAllEditorUids(state)

  expect(result).toEqual([])
})

test('getAllEditorUids should filter out tabs with editorUid -1', () => {
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

  const result = getAllEditorUids(state)

  expect(result).toEqual([])
})

test('getAllEditorUids should return all valid editorUids from single group', () => {
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
              editorUid: 101,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: 102,
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

  const result = getAllEditorUids(state)

  expect(result).toEqual([101, 102])
})

test('getAllEditorUids should return all valid editorUids from multiple groups', () => {
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
              editorUid: 101,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: 102,
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
              editorUid: 103,
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

  const result = getAllEditorUids(state)

  expect(result).toEqual([101, 102, 103])
})

test('getAllEditorUids should only return valid editorUids, filtering out -1', () => {
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
              editorUid: 101,
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
            {
              editorType: 'text',
              editorUid: 102,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
        {
          activeTabId: 4,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
            {
              editorType: 'text',
              editorUid: 103,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
          ],
        },
      ],
    },
  }

  const result = getAllEditorUids(state)

  expect(result).toEqual([101, 102, 103])
})

test('getAllEditorUids should handle three groups with mixed valid and invalid editorUids', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 33,
          tabs: [
            {
              editorType: 'text',
              editorUid: 201,
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
          size: 33,
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
        {
          activeTabId: 3,
          focused: false,
          id: 3,
          isEmpty: false,
          size: 34,
          tabs: [
            {
              editorType: 'text',
              editorUid: 203,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              editorType: 'text',
              editorUid: 204,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
          ],
        },
      ],
    },
  }

  const result = getAllEditorUids(state)

  expect(result).toEqual([201, 203, 204])
})
