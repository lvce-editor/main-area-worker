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

  const { newState, tabId } = ensureActiveGroup(state, '/test/file.ts')

  expect(tabId).toBeGreaterThan(0)
  expect(newState.layout.groups[0].tabs.length).toBe(1)
  expect(newState.layout.groups[0].tabs[0].id).toBe(tabId)
  expect(newState.layout.groups[0].tabs[0].uri).toBe('/test/file.ts')
  expect(newState.layout.groups[0].tabs[0].loadingState).toBe('loading')
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

  const { newState, tabId } = ensureActiveGroup(state, '/test/file.ts')

  expect(tabId).toBeGreaterThan(0)
  expect(newState.layout.groups.length).toBe(1)
  expect(newState.layout.groups[0].tabs.length).toBe(1)
  expect(newState.layout.groups[0].tabs[0].id).toBe(tabId)
  expect(newState.layout.groups[0].tabs[0].uri).toBe('/test/file.ts')
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

  const { newState, tabId } = ensureActiveGroup(state, '/test/file.ts')

  expect(newState.layout.groups[1].tabs.length).toBe(1)
  expect(newState.layout.groups[1].tabs[0].id).toBe(tabId)
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
              customEditorId: '',
              editorType: 'text' as const,
              editorUid: -1,
              errorMessage: '',
              id: 1,
              isDirty: false,
              language: '',
              loadingState: undefined,
              loadRequestId: 1,
              title: 'File 1',
              uri: '/existing/file.ts',
            },
          ],
        },
      ],
    },
  }

  const { newState, tabId } = ensureActiveGroup(state, '/test/file.ts')

  expect(newState.layout.groups[0].tabs.length).toBe(2)
  expect(newState.layout.groups[0].tabs[0].id).toBe(1)
  expect(newState.layout.groups[0].tabs[1].id).toBe(tabId)
  expect(newState.layout.groups[0].tabs[1].uri).toBe('/test/file.ts')
})
