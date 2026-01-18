import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { selectTab } from '../src/parts/SelectTab/SelectTab.ts'

const createMockState = (overrides: Partial<MainAreaState> = {}): MainAreaState => ({
  assetDir: '',
  layout: {
    activeGroupId: 'group1',
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 'tab1',
        focused: true,
        id: 'group1',
        size: 50,
        tabs: [
          {
            content: 'content1',
            editorType: 'text' as const,
            id: 'tab1',
            isDirty: false,
            title: 'File 1',
          },
          {
            content: 'content2',
            editorType: 'text' as const,
            id: 'tab2',
            isDirty: true,
            title: 'File 2',
          },
        ],
      },
      {
        activeTabId: 'tab3',
        focused: false,
        id: 'group2',
        size: 50,
        tabs: [
          {
            content: 'content3',
            editorType: 'text' as const,
            id: 'tab3',
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

  expect(result.layout.activeGroupId).toBe('group1')
  expect(result.layout.groups[0].activeTabId).toBe('tab2')
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[1].activeTabId).toBe('tab3') // unchanged
})

test('selectTab should switch to different group', async () => {
  const state = createMockState()

  const result = await selectTab(state, 1, 0)

  expect(result.layout.activeGroupId).toBe('group2')
  expect(result.layout.groups[0].activeTabId).toBe('tab1') // unchanged
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[1].activeTabId).toBe('tab3')
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
      activeGroupId: 'group1',
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 'tab1',
          focused: true,
          id: 'group1',
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text' as const,
              id: 'tab1',
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 0)

  expect(result.layout.activeGroupId).toBe('group1')
  expect(result.layout.groups[0].activeTabId).toBe('tab1')
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
      activeGroupId: 'group1',
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 'group1',
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
      activeGroupId: 'group1',
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 'tab1',
          focused: true,
          id: 'group1',
          size: 33,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              id: 'tab1',
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 'tab3',
          focused: false,
          id: 'group2',
          size: 33,
          tabs: [
            {
              content: 'content3',
              editorType: 'text' as const,
              id: 'tab3',
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
        {
          activeTabId: 'tab4',
          focused: false,
          id: 'group3',
          size: 34,
          tabs: [
            {
              content: 'content4',
              editorType: 'text' as const,
              id: 'tab4',
              isDirty: true,
              title: 'File 4',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 2, 0)

  expect(result.layout.activeGroupId).toBe('group3')
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[0].activeTabId).toBe('tab1')
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[1].activeTabId).toBe('tab3')
  expect(result.layout.groups[2].focused).toBe(true)
  expect(result.layout.groups[2].activeTabId).toBe('tab4')
})

test('selectTab should handle custom editor tabs', async () => {
  const state = createMockState({
    layout: {
      activeGroupId: 'group1',
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 'tab1',
          focused: true,
          id: 'group1',
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              id: 'tab1',
              isDirty: false,
              title: 'Text File',
            },
            {
              content: 'content2',
              customEditorId: 'custom-editor-1',
              editorType: 'custom' as const,
              id: 'tab2',
              isDirty: false,
              title: 'Custom Editor',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 1)

  expect(result.layout.activeGroupId).toBe('group1')
  expect(result.layout.groups[0].activeTabId).toBe('tab2')
  expect(result.layout.groups[0].focused).toBe(true)
})

test('selectTab should handle tabs with paths and languages', async () => {
  const state = createMockState({
    layout: {
      activeGroupId: 'group1',
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 'tab1',
          focused: false,
          id: 'group1',
          size: 100,
          tabs: [
            {
              content: 'console.log("hello");',
              editorType: 'text' as const,
              id: 'tab1',
              isDirty: false,
              language: 'javascript',
              path: '/path/to/script.js',
              title: 'script.js',
            },
            {
              content: '<div>Hello</div>',
              editorType: 'text' as const,
              id: 'tab2',
              isDirty: false,
              language: 'html',
              path: '/path/to/index.html',
              title: 'index.html',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 1)

  expect(result.layout.activeGroupId).toBe('group1')
  expect(result.layout.groups[0].activeTabId).toBe('tab2')
  expect(result.layout.groups[0].focused).toBe(true)
})

test('selectTab should handle vertical layout direction', async () => {
  const state = createMockState({
    layout: {
      activeGroupId: 'group1',
      direction: 'vertical',
      groups: [
        {
          activeTabId: 'tab1',
          focused: true,
          id: 'group1',
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              id: 'tab1',
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 'tab2',
          focused: false,
          id: 'group2',
          size: 50,
          tabs: [
            {
              content: 'content2',
              editorType: 'text' as const,
              id: 'tab2',
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 1, 0)

  expect(result.layout.activeGroupId).toBe('group2')
  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[1].focused).toBe(true)
})

test('selectTab should return same state when clicking same tab that is already active', async () => {
  const state = createMockState()

  const result = await selectTab(state, 0, 0)

  expect(result.layout.activeGroupId).toBe('group1')
  expect(result.layout.groups[0].activeTabId).toBe('tab1')
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result).toBe(state) // Should return the same state object
})

test('selectTab should return new state when clicking different tab in same group', async () => {
  const state = createMockState()

  const result = await selectTab(state, 0, 1)

  expect(result.layout.activeGroupId).toBe('group1')
  expect(result.layout.groups[0].activeTabId).toBe('tab2')
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result).not.toBe(state) // Should return new state object
})

test('selectTab should return new state when clicking same tab index in different group', async () => {
  const state = createMockState()

  const result = await selectTab(state, 1, 0)

  expect(result.layout.activeGroupId).toBe('group2')
  expect(result.layout.groups[1].activeTabId).toBe('tab3')
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
          id: 'group1',
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text' as const,
              id: 'tab1',
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  })

  const result = await selectTab(state, 0, 0)

  expect(result.layout.activeGroupId).toBe('group1')
  expect(result.layout.groups[0].activeTabId).toBe('tab1')
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result).not.toBe(state) // Should return new state object since nothing was active before
})
