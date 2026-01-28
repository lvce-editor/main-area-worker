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
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
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

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(2)
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
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
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
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
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

test('closeFocusedTab should close the last tab in focused group', () => {
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

  expect(result.layout.groups[0].tabs.length).toBe(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
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
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: true,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
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

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[1].tabs.length).toBe(1)
  expect(result.layout.groups[1].tabs[0].id).toBe(3)
  expect(result.layout.groups[1].activeTabId).toBe(3)
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
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
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
          size: 50,
          tabs: [
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
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

  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].id).toBe(2)
  expect(result.layout.groups[0].size).toBe(100)
  expect(result.layout.activeGroupId).toBe(2)
  expect(result).not.toBe(state)
})
