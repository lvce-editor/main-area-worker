import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeSaved } from '../src/parts/CloseSaved/CloseSaved.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeSaved should close all non-dirty tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
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
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'saved-1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: true,
              isPreview: false,
              title: 'dirty.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              isPreview: false,
              title: 'saved-2.txt',
            },
          ],
        },
      ],
    },
  }

  const result = closeSaved(state)

  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeSaved should update activeTabId when active tab is closed', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
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
              id: 1,
              isDirty: true,
              isPreview: false,
              title: 'dirty-1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'saved.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: true,
              isPreview: false,
              title: 'dirty-2.txt',
            },
          ],
        },
      ],
    },
  }

  const result = closeSaved(state)

  expect(result.layout.groups[0].tabs).toHaveLength(2)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].tabs[1].id).toBe(3)
  expect(result.layout.groups[0].activeTabId).toBe(3)
})

test('closeSaved should mark group empty when no dirty tabs remain', () => {
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
              isPreview: false,
              title: 'saved.txt',
            },
          ],
        },
      ],
    },
  }

  const result = closeSaved(state)

  expect(result.layout.groups[0].tabs).toEqual([])
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
  expect(result.layout.groups[0].isEmpty).toBe(true)
})

test('closeSaved should preserve groups with only dirty tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
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
              isDirty: true,
              isPreview: false,
              title: 'dirty-1.txt',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: true,
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
              isPreview: false,
              title: 'saved-1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: true,
              isPreview: false,
              title: 'dirty-2.txt',
            },
          ],
        },
      ],
    },
  }

  const result = closeSaved(state)

  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[1].tabs).toHaveLength(1)
  expect(result.layout.groups[1].tabs[0].id).toBe(3)
  expect(result.layout.groups[1].activeTabId).toBe(3)
})
