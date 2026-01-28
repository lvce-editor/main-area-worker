import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { selectTab } from '../src/parts/SelectTab/SelectTab.ts'

const createMockState = (overrides: Partial<MainAreaState> = {}): MainAreaState => ({
  assetDir: '',
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
            editorUid: -1,
            editorType: 'text' as const,
            id: 1,
            isDirty: false,
            title: 'File 1',
          },
          {
            content: 'content2',
            editorUid: -1,
            editorType: 'text' as const,
            id: 2,
            isDirty: true,
            title: 'File 2',
          },
        ],
      },
      {
        activeTabId: 3,
        focused: false,
        id: 2,
        size: 50,
        tabs: [
          {
            content: 'content3',
            editorUid: -1,
            editorType: 'text' as const,
            id: 3,
            isDirty: false,
            title: 'File 3',
          },
        ],
      },
    ],
  },
  platform: 1,
  uid: 1,
  ...overrides,
})

test('selectTab should update active group and tab with valid indexes', async () => {
  const state = createMockState()

  const result = await selectTab(state, 0, 1)

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[1].activeTabId).toBe(3) // unchanged
})

test('selectTab should switch to different group', async () => {
  const state = createMockState()

  const result = await selectTab(state, 1, 0)

  expect(result.layout.activeGroupId).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(1) // unchanged
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[1].activeTabId).toBe(3)
  expect(result.layout.groups[1].focused).toBe(true)
})

test('selectTab should return original state for invalid group index', async () => {
  const state = createMockState()

  const result = await selectTab(state, 2, 0)

  expect(result).toBe(state)
})

test('selectTab should return original state for negative group index', async () => {
  const state = createMockState()

  const result = await selectTab(state, -1, 0)

  expect(result).toBe(state)
})

test('selectTab should return original state for invalid tab index', async () => {
  const state = createMockState()

  const result = await selectTab(state, 0, 2)

  expect(result).toBe(state)
})

test('selectTab should return original state for negative tab index', async () => {
  const state = createMockState()

  const result = await selectTab(state, 0, -1)

  expect(result).toBe(state)
})

test('selectTab should handle single group with single tab', async () => {
  const state = createMockState({
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
              content: 'content',
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 0)

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result).toBe(state) // Should return same state since it's already active
})

test('selectTab should handle empty groups array', async () => {
  const state = createMockState({
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  })

  const result = await selectTab(state, 0, 0)

  expect(result).toBe(state)
})

test('selectTab should handle group with empty tabs array', async () => {
  const state = createMockState({
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 0)

  expect(result).toBe(state)
})

test('selectTab should preserve other groups state when switching focus', async () => {
  const state = createMockState({
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 33,
          tabs: [
            {
              content: 'content1',
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          size: 33,
          tabs: [
            {
              content: 'content3',
              editorUid: -1,
              editorType: 'text' as const,
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
        {
          activeTabId: 4,
          focused: false,
          id: 3,
          size: 34,
          tabs: [
            {
              content: 'content4',
              editorUid: -1,
              editorType: 'text' as const,
              id: 4,
              isDirty: true,
              title: 'File 4',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 2, 0)

  expect(result.layout.activeGroupId).toBe(3)
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[1].activeTabId).toBe(3)
  expect(result.layout.groups[2].focused).toBe(true)
  expect(result.layout.groups[2].activeTabId).toBe(4)
})

test('selectTab should handle custom editor tabs', async () => {
  const state = createMockState({
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
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'Text File',
            },
            {
              content: 'content2',
              customEditorId: 'custom-editor-1',
              editorUid: -1,
              editorType: 'custom' as const,
              id: 2,
              isDirty: false,
              title: 'Custom Editor',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 1)

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[0].focused).toBe(true)
})

test('selectTab should handle tabs with paths and languages', async () => {
  const state = createMockState({
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
              content: 'console.log("hello");',
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              language: 'javascript',
              uri: '/path/to/script.js',
              title: 'script.js',
            },
            {
              content: '<div>Hello</div>',
              editorUid: -1,
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              language: 'html',
              uri: '/path/to/index.html',
              title: 'index.html',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 1)

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[0].focused).toBe(true)
})

test('selectTab should handle vertical layout direction', async () => {
  const state = createMockState({
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorUid: -1,
              editorType: 'text' as const,
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
              editorUid: -1,
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 1, 0)

  expect(result.layout.activeGroupId).toBe(2)
  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[1].focused).toBe(true)
})

test('selectTab should return same state when clicking same tab that is already active', async () => {
  const state = createMockState()

  const result = await selectTab(state, 0, 0)

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result).toBe(state) // Should return the same state object
})

test('selectTab should return new state when clicking different tab in same group', async () => {
  const state = createMockState()

  const result = await selectTab(state, 0, 1)

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result).not.toBe(state) // Should return new state object
})

test('selectTab should return new state when clicking same tab index in different group', async () => {
  const state = createMockState()

  const result = await selectTab(state, 1, 0)

  expect(result.layout.activeGroupId).toBe(2)
  expect(result.layout.groups[1].activeTabId).toBe(3)
  expect(result.layout.groups[1].focused).toBe(true)
  expect(result).not.toBe(state) // Should return new state object
})

test('selectTab should return same state when activeGroupId is undefined', async () => {
  const state = createMockState({
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 0)

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result).not.toBe(state) // Should return new state object since nothing was active before
})

test('selectTab should not trigger loading when tab is already loading', async () => {
  const state: MainAreaState = createMockState({
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
              content: '',
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: '',
              editorUid: -1,
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              loadingState: 'loading',
              loadRequestId: 42,
              uri: '/path/to/file.ts',
              title: 'File 2',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 1)

  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[0].tabs[1].loadingState).toBe('loading')
  expect(result.layout.groups[0].tabs[1].loadRequestId).toBe(42)
})

test('selectTab should not trigger loading when tab is already loaded with content', async () => {
  const state: MainAreaState = createMockState({
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
              content: '',
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'already loaded content',
              editorUid: -1,
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              loadingState: 'loaded',
              uri: '/path/to/file.ts',
              title: 'File 2',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 1)

  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[0].tabs[1].loadingState).toBe('loaded')
  expect(result.layout.groups[0].tabs[1].content).toBe('already loaded content')
})
