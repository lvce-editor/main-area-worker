import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleUriChange } from '../src/parts/HandleUriChange/HandleUriChange.ts'

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

test('handleUriChange should update single tab URI', () => {
  const state = createStateWithTabs([{ uri: '/test/oldfile.txt' }])
  const result = handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  expect(result.layout.groups[0].tabs[0].uri).toBe('/test/newfile.txt')
})

test('handleUriChange should update multiple tabs with same old URI', () => {
  const state = createStateWithTabs([
    { id: 1, title: 'shared1', uri: '/test/shared.txt' },
    { id: 2, title: 'shared2', uri: '/test/shared.txt' },
    { id: 3, title: 'other', uri: '/test/other.txt' },
  ])
  const result = handleUriChange(state, '/test/shared.txt', '/test/newshared.txt')

  expect(result.layout.groups[0].tabs[0].uri).toBe('/test/newshared.txt')
  expect(result.layout.groups[0].tabs[1].uri).toBe('/test/newshared.txt')
  expect(result.layout.groups[0].tabs[2].uri).toBe('/test/other.txt')
})

test('handleUriChange should not affect tabs with different URIs', () => {
  const state = createStateWithTabs([
    { id: 1, uri: '/test/file1.txt' },
    { id: 2, uri: '/test/file2.txt' },
    { id: 3, uri: '/test/file3.txt' },
  ])
  const result = handleUriChange(state, '/test/file1.txt', '/test/renamed.txt')

  expect(result.layout.groups[0].tabs[0].uri).toBe('/test/renamed.txt')
  expect(result.layout.groups[0].tabs[1].uri).toBe('/test/file2.txt')
  expect(result.layout.groups[0].tabs[2].uri).toBe('/test/file3.txt')
})

test('handleUriChange should work with multiple editor groups', () => {
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
              uri: '/test/oldfile.txt',
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
              uri: '/test/oldfile.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  expect(result.layout.groups[0].tabs[0].uri).toBe('/test/newfile.txt')
  expect(result.layout.groups[1].tabs[0].uri).toBe('/test/newfile.txt')
})

test('handleUriChange should preserve other tab properties', () => {
  const state = createStateWithTabs([
    {
      editorType: 'text',
      icon: 'file-icon',
      id: 1,
      isDirty: true,
      title: 'Original Title',
      uri: '/test/oldfile.txt',
    },
  ])
  const result = handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  const updatedTab = result.layout.groups[0].tabs[0]
  expect(updatedTab.uri).toBe('/test/newfile.txt')
  expect(updatedTab.title).toBe('newfile.txt')
  expect(updatedTab.isDirty).toBe(true)
  expect(updatedTab.editorType).toBe('text')
  expect(updatedTab.icon).toBe('file-icon')
})

test('handleUriChange should preserve state structure', () => {
  const state = createStateWithTabs([{ uri: '/test/oldfile.txt' }])
  const result = handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  expect(result).toHaveProperty('layout')
  expect(result).toHaveProperty('layout.groups')
  expect(result).toHaveProperty('layout.activeGroupId')
  expect(result).toHaveProperty('layout.direction')
  expect(result.layout.activeGroupId).toBe(state.layout.activeGroupId)
  expect(result.layout.direction).toBe(state.layout.direction)
})

test('handleUriChange should not mutate original state', () => {
  const state = createStateWithTabs([{ uri: '/test/oldfile.txt' }])
  const originalUri = state.layout.groups[0].tabs[0].uri
  handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  expect(state.layout.groups[0].tabs[0].uri).toBe(originalUri)
})

test('handleUriChange should handle non-matching URI', () => {
  const state = createStateWithTabs([{ uri: '/test/file.txt' }])
  const result = handleUriChange(state, '/test/nonexistent.txt', '/test/newfile.txt')

  expect(result.layout.groups[0].tabs[0].uri).toBe('/test/file.txt')
})

test('handleUriChange should handle empty groups', () => {
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

  const result = handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  expect(result.layout.groups[0].tabs).toHaveLength(0)
})

test('handleUriChange should handle tabs without URI property', () => {
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
              title: 'file.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  expect(result.layout.groups[0].tabs[0].uri).toBeUndefined()
})

test('handleUriChange should work with absolute and relative paths', () => {
  const state = createStateWithTabs([
    { id: 1, uri: '/absolute/path/file.txt' },
    { id: 2, uri: 'relative/path/file.txt' },
  ])
  const result = handleUriChange(state, '/absolute/path/file.txt', '/absolute/path/newfile.txt')

  expect(result.layout.groups[0].tabs[0].uri).toBe('/absolute/path/newfile.txt')
  expect(result.layout.groups[0].tabs[1].uri).toBe('relative/path/file.txt')
})

test('handleUriChange should work with URIs containing special characters', () => {
  const oldUri = '/test/file with spaces.txt'
  const newUri = '/test/file-with-dashes.txt'
  const state = createStateWithTabs([{ uri: oldUri }])
  const result = handleUriChange(state, oldUri, newUri)

  expect(result.layout.groups[0].tabs[0].uri).toBe(newUri)
})

test('handleUriChange should preserve group properties', () => {
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
              uri: '/test/oldfile.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].isEmpty).toBe(false)
  expect(result.layout.groups[0].size).toBe(75)
})

test('handleUriChange should update tab title to match new URI basename', () => {
  const state = createStateWithTabs([{ uri: '/test/oldfile.txt' }])
  const result = handleUriChange(state, '/test/oldfile.txt', '/test/newfile.txt')

  expect(result.layout.groups[0].tabs[0].title).toBe('newfile.txt')
})

test('handleUriChange should extract basename from complex paths', () => {
  const state = createStateWithTabs([{ uri: '/path/to/oldfile.ts' }])
  const result = handleUriChange(state, '/path/to/oldfile.ts', '/path/to/components/newfile.ts')

  expect(result.layout.groups[0].tabs[0].title).toBe('newfile.ts')
  expect(result.layout.groups[0].tabs[0].uri).toBe('/path/to/components/newfile.ts')
})

test('handleUriChange should update title for multiple tabs with same old URI', () => {
  const state = createStateWithTabs([
    { id: 1, title: 'old', uri: '/test/shared.txt' },
    { id: 2, title: 'old', uri: '/test/shared.txt' },
    { id: 3, title: 'other', uri: '/test/other.txt' },
  ])
  const result = handleUriChange(state, '/test/shared.txt', '/test/newname.json')

  expect(result.layout.groups[0].tabs[0].title).toBe('newname.json')
  expect(result.layout.groups[0].tabs[1].title).toBe('newname.json')
  expect(result.layout.groups[0].tabs[2].title).toBe('other')
})

test('handleUriChange should handle URIs with special characters in basename', () => {
  const state = createStateWithTabs([{ uri: '/test/old-file.txt' }])
  const result = handleUriChange(state, '/test/old-file.txt', '/test/new-file-v2.txt')

  expect(result.layout.groups[0].tabs[0].title).toBe('new-file-v2.txt')
})

test('handleUriChange should handle URIs with file extensions', () => {
  const state = createStateWithTabs([
    { id: 1, uri: '/test/file.ts' },
    { id: 2, uri: '/test/file.js' },
    { id: 3, uri: '/test/file.json' },
  ])

  const result1 = handleUriChange(state, '/test/file.ts', '/test/updated.tsx')
  expect(result1.layout.groups[0].tabs[0].title).toBe('updated.tsx')

  const result2 = handleUriChange(state, '/test/file.js', '/test/updated.jsx')
  expect(result2.layout.groups[0].tabs[1].title).toBe('updated.jsx')

  const result3 = handleUriChange(state, '/test/file.json', '/test/config.json')
  expect(result3.layout.groups[0].tabs[2].title).toBe('config.json')
})
