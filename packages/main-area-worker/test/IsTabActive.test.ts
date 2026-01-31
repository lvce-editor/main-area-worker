import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isTabActive } from '../src/parts/IsTabActive/IsTabActive.ts'

test('isTabActive returns true for active tab in active group', () => {
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
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  expect(isTabActive(state, 1)).toBe(true)
  expect(isTabActive(state, 2)).toBe(false)
})

test('isTabActive returns false for tab in non-active group', () => {
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
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  expect(isTabActive(state, 1)).toBe(true)
  expect(isTabActive(state, 2)).toBe(false) // Active in group 2, but group 2 is not the active group
})

test('isTabActive returns false when no active group exists', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 999, // Non-existent group
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  expect(isTabActive(state, 1)).toBe(false)
})
