import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { updateTab } from '../src/parts/UpdateTab/UpdateTab.ts'

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
          size: 100,
          tabs,
        },
      ],
    },
    uid: 1,
  }
}

const createStateWithMultipleGroups = (): MainAreaState => {
  return {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,,
    isEmpty: false
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,,
    isEmpty: false
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'file3.txt',
              uri: '/test/file3.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }
}

test('updateTab updates a single property', () => {
  const state = createStateWithTabs()
  const result = updateTab(state, 1, { isDirty: true })

  const tab = result.layout.groups[0].tabs.find((t) => t.id === 1)
  expect(tab?.isDirty).toBe(true)
  expect(tab?.uri).toBe('/test/file.txt')
})

test('updateTab updates multiple properties', () => {
  const state = createStateWithTabs()
  const result = updateTab(state, 1, {
    isDirty: true,
    loadingState: 'loaded',
  })

  const tab = result.layout.groups[0].tabs.find((t) => t.id === 1)
  expect(tab?.isDirty).toBe(true)
  expect(tab?.loadingState).toBe('loaded')
})

test('updateTab returns unchanged state when tab not found', () => {
  const state = createStateWithTabs()
  const result = updateTab(state, 999, { isDirty: true })

  expect(result).toEqual(state)
})

test('updateTab only updates the specified tab', () => {
  const state = createStateWithTabs([{}, {}, {}])
  const result = updateTab(state, 2, { isDirty: true })

  const { tabs } = result.layout.groups[0]
  expect(tabs[0].isDirty).toBe(false)
  expect(tabs[1].isDirty).toBe(true)
  expect(tabs[2].isDirty).toBe(false)
})

test('updateTab works with multiple groups', () => {
  const state = createStateWithMultipleGroups()
  const result = updateTab(state, 3, { isDirty: true })

  const tab = result.layout.groups[1].tabs.find((t) => t.id === 3)
  expect(tab?.isDirty).toBe(true)
})

test('updateTab updates tab in first group without affecting second group', () => {
  const state = createStateWithMultipleGroups()
  const result = updateTab(state, 2, { isDirty: true })

  const tab = result.layout.groups[0].tabs.find((t) => t.id === 2)
  expect(tab?.isDirty).toBe(true)

  const group2Tab = result.layout.groups[1].tabs[0]
  expect(group2Tab.isDirty).toBe(false)
})

test('updateTab preserves other state properties', () => {
  const state = createStateWithTabs()
  const result = updateTab(state, 1, { isDirty: true })

  expect(result.uid).toBe(state.uid)
  expect(result.layout.activeGroupId).toBe(state.layout.activeGroupId)
  expect(result.layout.direction).toBe(state.layout.direction)
})

test('updateTab handles errorMessage property', () => {
  const state = createStateWithTabs()
  const result = updateTab(state, 1, {
    errorMessage: 'File not found',
    loadingState: 'error',
  })

  const tab = result.layout.groups[0].tabs.find((t) => t.id === 1)
  expect(tab?.errorMessage).toBe('File not found')
  expect(tab?.loadingState).toBe('error')
})

test('updateTab handles loadRequestId property', () => {
  const state = createStateWithTabs()
  const result = updateTab(state, 1, { loadingState: 'loading' })

  const tab = result.layout.groups[0].tabs.find((t) => t.id === 1)
  expect(tab?.loadingState).toBe('loading')
})

test('updateTab does not mutate original state', () => {
  const state = createStateWithTabs()
  const result = updateTab(state, 1, { isDirty: true })
  const originalTab = state.layout.groups[0].tabs[0]

  expect(originalTab.isDirty).toBe(false)
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
})

test('updateTab clears errorMessage when content is loaded', () => {
  const state = createStateWithTabs([{ errorMessage: 'Previous error', loadingState: 'error' }])
  const result = updateTab(state, 1, {
    errorMessage: undefined,
    loadingState: 'loaded',
  })

  const tab = result.layout.groups[0].tabs.find((t) => t.id === 1)
  expect(tab?.errorMessage).toBeUndefined()
  expect(tab?.loadingState).toBe('loaded')
})
