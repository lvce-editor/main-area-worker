import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { ensureActiveGroup } from '../src/parts/EnsureActiveGroup/EnsureActiveGroup.ts'

test('ensureActiveGroup should add tab to existing active group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: -1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const newState = ensureActiveGroup(state, '/test/file.ts')
  const tabId = newState.layout.groups[0].tabs[0].id

  expect(tabId).toBeGreaterThan(0)
  expect(newState.layout.groups[0].tabs.length).toBe(1)
  expect(newState.layout.groups[0].tabs[0].id).toBe(tabId)
  expect(newState.layout.groups[0].tabs[0].uri).toBe('/test/file.ts')
  expect(newState.layout.groups[0].tabs[0].loadingState).toBe('loading')
  expect(newState.layout.groups[0].tabs[0].title).toBe('file.ts')
  expect(newState.layout.groups[0].activeTabId).toBe(tabId)
  expect(newState).not.toBe(state)
})

test('ensureActiveGroup should create new group when no active group exists', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }

  const newState = ensureActiveGroup(state, '/test/file.ts')
  const tabId = newState.layout.groups[0].tabs[0].id
  const groupId = newState.layout.groups[0].id
  const { editorUid } = newState.layout.groups[0].tabs[0]

  expect(newState.layout).toEqual({
    activeGroupId: groupId,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: tabId,
        focused: true,
        id: groupId,
        size: 100,
        tabs: [
          {
            content: '',
            editorType: 'text',
            editorUid,
            errorMessage: '',
            icon: '',
            id: tabId,
            isDirty: false,
            language: '',
            loadingState: 'loading',
            title: 'file.ts',
            uri: '/test/file.ts',
          },
        ],
      },
    ],
  })
  expect(editorUid).toBeGreaterThan(0)
})

test('ensureActiveGroup should use focused group when activeGroupId is undefined', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: -1,
          focused: false,
          id: 1,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: -1,
          focused: true,
          id: 2,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  const newState = ensureActiveGroup(state, '/test/file.ts')
  const tabId = newState.layout.groups[1].tabs[0].id

  expect(newState.layout.groups[1].tabs.length).toBe(1)
  expect(newState.layout.groups[1].tabs[0].id).toBe(tabId)
  expect(newState.layout.groups[1].tabs[0].uri).toBe('/test/file.ts')
  expect(newState.layout.groups[1].tabs[0].title).toBe('file.ts')
  expect(newState.layout.groups[1].activeTabId).toBe(tabId)
  expect(newState.layout.groups[0].tabs.length).toBe(0)
})

test('ensureActiveGroup should preserve existing tabs when adding new tab', () => {
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
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              language: '',
              loadingState: 'loading' as const,
              title: 'File 1',
              uri: '/existing/file.ts',
            },
          ],
        },
      ],
    },
  }

  const newState = ensureActiveGroup(state, '/test/file.ts')
  const tabId = newState.layout.groups[0].tabs[1].id
  const { editorUid } = newState.layout.groups[0].tabs[1]

  expect(newState.layout).toEqual({
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: tabId,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            content: 'content1',
            editorType: 'text',
            editorUid: -1,
            errorMessage: '',
            icon: '',
            id: 1,
            isDirty: false,
            language: '',
            loadingState: 'loading',
            title: 'File 1',
            uri: '/existing/file.ts',
          },
          {
            content: '',
            editorType: 'text',
            editorUid,
            errorMessage: '',
            icon: '',
            id: tabId,
            isDirty: false,
            language: '',
            loadingState: 'loading',
            title: 'file.ts',
            uri: '/test/file.ts',
          },
        ],
      },
    ],
  })
  expect(editorUid).toBeGreaterThan(0)
})
