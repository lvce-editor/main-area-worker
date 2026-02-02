import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleModifiedStatusChange } from '../src/parts/HandleModifiedStatusChange/HandleModifiedStatusChange.ts'

const createStateWithTabs = (tabOverrides: Partial<Tab>[] = []): MainAreaState => {
  const tabs: Tab[] =
    tabOverrides.length > 0
      ? tabOverrides.map((override, index) => ({
          editorType: 'text',
          editorUid: -1,
          icon: '',
          id: index + 1,
          isDirty: false,
          title: `file${index + 1}.txt`,
          uri: `/test/file${index + 1}.txt`,
          ...override,
        }))
      : [
          {
            editorType: 'text',
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'file.txt',
            uri: '/test/file.txt',
          },
        ]

  return {
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
          tabs,
        },
      ],
    },
    uid: 1,
  }
}

test('handleModifiedStatusChange should update single tab modified status to true', () => {
  const state = createStateWithTabs([{ isDirty: false, uri: '/test/file.txt' }])
  const result = handleModifiedStatusChange(state, '/test/file.txt', true)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
})

test('handleModifiedStatusChange should update single tab modified status to false', () => {
  const state = createStateWithTabs([{ isDirty: true, uri: '/test/file.txt' }])
  const result = handleModifiedStatusChange(state, '/test/file.txt', false)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('handleModifiedStatusChange should update multiple tabs with same URI', () => {
  const state = createStateWithTabs([
    { id: 1, isDirty: false, uri: '/test/shared.txt' },
    { id: 2, isDirty: false, uri: '/test/shared.txt' },
    { id: 3, isDirty: false, uri: '/test/other.txt' },
  ])
  const result = handleModifiedStatusChange(state, '/test/shared.txt', true)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
  expect(result.layout.groups[0].tabs[1].isDirty).toBe(true)
  expect(result.layout.groups[0].tabs[2].isDirty).toBe(false)
})

test('handleModifiedStatusChange should not affect tabs with different URIs', () => {
  const state = createStateWithTabs([
    { id: 1, isDirty: false, uri: '/test/file1.txt' },
    { id: 2, isDirty: false, uri: '/test/file2.txt' },
    { id: 3, isDirty: false, uri: '/test/file3.txt' },
  ])
  const result = handleModifiedStatusChange(state, '/test/file1.txt', true)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
  expect(result.layout.groups[0].tabs[1].isDirty).toBe(false)
  expect(result.layout.groups[0].tabs[2].isDirty).toBe(false)
})

test('handleModifiedStatusChange should work with multiple editor groups', () => {
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
              title: 'file1.txt',
              uri: '/test/file.txt',
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
              title: 'file2.txt',
              uri: '/test/file.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = handleModifiedStatusChange(state, '/test/file.txt', true)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
  expect(result.layout.groups[1].tabs[0].isDirty).toBe(true)
})

test('handleModifiedStatusChange should preserve other tab properties', () => {
  const state = createStateWithTabs([
    {
      editorType: 'text',
      icon: 'file-icon',
      id: 1,
      isDirty: false,
      title: 'file.txt',
      uri: '/test/file.txt',
    },
  ])
  const result = handleModifiedStatusChange(state, '/test/file.txt', true)

  const updatedTab = result.layout.groups[0].tabs[0]
  expect(updatedTab.isDirty).toBe(true)
  expect(updatedTab.uri).toBe('/test/file.txt')
  expect(updatedTab.title).toBe('file.txt')
  expect(updatedTab.isDirty).toBe(true)
  expect(updatedTab.editorType).toBe('text')
  expect(updatedTab.icon).toBe('file-icon')
})

test('handleModifiedStatusChange should preserve state structure', () => {
  const state = createStateWithTabs([{ isDirty: false, uri: '/test/file.txt' }])
  const result = handleModifiedStatusChange(state, '/test/file.txt', true)

  expect(result).toHaveProperty('layout')
  expect(result).toHaveProperty('layout.groups')
  expect(result).toHaveProperty('layout.activeGroupId')
  expect(result).toHaveProperty('layout.direction')
  expect(result.layout.activeGroupId).toBe(state.layout.activeGroupId)
  expect(result.layout.direction).toBe(state.layout.direction)
})

test('handleModifiedStatusChange should not mutate original state', () => {
  const state = createStateWithTabs([{ isDirty: false, uri: '/test/file.txt' }])
  const originalStatus = state.layout.groups[0].tabs[0].isDirty
  handleModifiedStatusChange(state, '/test/file.txt', true)

  expect(state.layout.groups[0].tabs[0].isDirty).toBe(originalStatus)
})

test('handleModifiedStatusChange should handle non-matching URI', () => {
  const state = createStateWithTabs([{ isDirty: false, uri: '/test/file.txt' }])
  const result = handleModifiedStatusChange(state, '/test/nonexistent.txt', true)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('handleModifiedStatusChange should handle empty groups', () => {
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
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
    uid: 1,
  }

  const result = handleModifiedStatusChange(state, '/test/file.txt', true)

  expect(result.layout.groups[0].tabs).toHaveLength(0)
})

test('handleModifiedStatusChange should preserve group properties', () => {
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
          size: 75,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file.txt',
              uri: '/test/file.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = handleModifiedStatusChange(state, '/test/file.txt', true)

  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].isEmpty).toBe(false)
  expect(result.layout.groups[0].size).toBe(75)
})

test('handleModifiedStatusChange should toggle modified status multiple times', () => {
  const state = createStateWithTabs([{ isDirty: false, uri: '/test/file.txt' }])

  const result1 = handleModifiedStatusChange(state, '/test/file.txt', true)
  expect(result1.layout.groups[0].tabs[0].isDirty).toBe(true)

  const result2 = handleModifiedStatusChange(result1, '/test/file.txt', false)
  expect(result2.layout.groups[0].tabs[0].isDirty).toBe(false)

  const result3 = handleModifiedStatusChange(result2, '/test/file.txt', true)
  expect(result3.layout.groups[0].tabs[0].isDirty).toBe(true)
})
