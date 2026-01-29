import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeTab, closeTabWithViewlet, findTabInState } from '../src/parts/CloseTab/CloseTab.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeTab should close a non-active tab', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result).not.toBe(state)
})

test('closeTab should close the active tab and select next tab', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 1)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeTab should close the last tab and set activeTabId to undefined', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
  expect(result).not.toBe(state)
})

test('closeTab should close active tab in middle and select tab at same index', () => {
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
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(3)
  expect(result).not.toBe(state)
})

test('closeTab should close last tab when active and select previous tab', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 3,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 3)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 3)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeTab should return state unchanged when group does not exist', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 999, 1)

  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.activeGroupId).toBe(1)
})

test('closeTab should return state unchanged when tab does not exist', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 999)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result).not.toBe(state)
})

test('closeTab should preserve other groups when closing tab', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
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
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[1].tabs.length).toBe(1)
  expect(result.layout.groups[1].activeTabId).toBe(3)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing tab from different group', () => {
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
              icon: '',
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
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 2, 2)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[1].tabs.length).toBe(1)
  expect(result.layout.groups[1].activeTabId).toBe(3)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result).not.toBe(state)
})

test('closeTab should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test',
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
    platform: 1,
    uid: 123,
  }

  const result = closeTab(state, 1, 2)

  expect(result.assetDir).toBe('/test')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(123)
  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.activeGroupId).toBe(1)
})

test('closeTab should handle closing tab when group has no active tab', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
  expect(result).not.toBe(state)
})

test('closeTab should handle closing first tab when active', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeTab should handle multiple groups with multiple tabs', () => {
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
          size: 33,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
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
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              content: 'content4',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
          ],
        },
        {
          activeTabId: 5,
          focused: false,
          id: 3,
          size: 34,
          tabs: [
            {
              content: 'content5',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 2, 3)

  expect(result.layout.groups.length).toBe(3)
  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[1].tabs.length).toBe(1)
  expect(result.layout.groups[2].tabs.length).toBe(1)
  expect(result.layout.groups[1].activeTabId).toBe(4)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[2].activeTabId).toBe(5)
  expect(result).not.toBe(state)
})

test('closeTab should handle tabs with custom editor type', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              customEditorId: 'custom-editor-1',
              editorType: 'custom' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'Custom Editor',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result).not.toBe(state)
})

test('closeTab should handle tabs with paths and languages', () => {
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
              content: 'console.log("hello");',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              language: 'javascript',
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
            {
              content: '<div>Hello</div>',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              language: 'html',
              title: 'index.html',
              uri: '/path/to/index.html',
            },
            {
              content: 'body { color: red; }',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              language: 'css',
              title: 'style.css',
              uri: '/path/to/style.css',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing dirty tabs', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: true,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: true,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing active dirty tab', () => {
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
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: true,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(3)
  expect(result).not.toBe(state)
})

test('closeTab should handle empty tabs array', () => {
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
          tabs: [],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
  expect(result).not.toBe(state)
})

test('closeTab should handle closing tab when activeTabId is undefined', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
  expect(result).not.toBe(state)
})

test('closeTab should handle closing second tab when first is active', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing tab from group with single tab', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
  expect(result).not.toBe(state)
})

test('closeTab should handle closing tab from multiple groups preserving layout', () => {
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
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
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
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              content: 'content4',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 2)

  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[1].tabs.length).toBe(2)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].size).toBe(50)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing tab when tab index is at boundary', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing tab with same ID as group ID', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing tab from group with many tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 5,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              content: 'content4',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
            {
              content: 'content5',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
            {
              content: 'content6',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 6,
              isDirty: false,
              title: 'File 6',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 5)

  expect(result.layout.groups[0].tabs.length).toBe(5)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 5)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(6)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing middle tab from many tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 3,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              content: 'content4',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
            {
              content: 'content5',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 3)

  expect(result.layout.groups[0].tabs.length).toBe(4)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 3)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(4)
  expect(result).not.toBe(state)
})

test('closeTab should handle closing non-active tab from many tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 3,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              content: 'content4',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(3)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 1)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(3)
  expect(result).not.toBe(state)
})

test('closeTab should remove editor group when closing last tab and multiple groups exist', () => {
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
              icon: '',
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
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].id).toBe(2)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].size).toBe(100)
  expect(result.layout.activeGroupId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeTab should remove editor group when closing last tab and update activeGroupId', () => {
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
          size: 33,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
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
          size: 33,
          tabs: [
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 3,
          size: 34,
          tabs: [
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 2, 2)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups.find((group) => group.id === 2)).toBeUndefined()
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].size).toBe(50)
  expect(result).not.toBe(state)
})

test('closeTab should not remove editor group when closing last tab if it is the only group', () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 1, 1)

  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].tabs.length).toBe(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
  expect(result).not.toBe(state)
})

test('closeTab should redistribute sizes when removing group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          size: 25,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
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
          size: 25,
          tabs: [
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 3,
          size: 50,
          tabs: [
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              content: 'content4',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
          ],
        },
      ],
    },
  }

  const result = closeTab(state, 2, 2)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups.find((group) => group.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].size).toBe(50)
  expect(result.layout.activeGroupId).toBe(1)
  expect(result).not.toBe(state)
})

// Tests for findTabInState (lines 7-9)

test('findTabInState should find a tab in the specified group', () => {
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

  const result = findTabInState(state, 1, 2)

  expect(result).toBeDefined()
  expect(result?.id).toBe(2)
  expect(result?.title).toBe('File 2')
})

test('findTabInState should return undefined when tab does not exist', () => {
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

  const result = findTabInState(state, 1, 999)

  expect(result).toBeUndefined()
})

test('findTabInState should return undefined when group does not exist', () => {
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

  const result = findTabInState(state, 999, 1)

  expect(result).toBeUndefined()
})

test('findTabInState should find tab in different groups', () => {
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

  const result1 = findTabInState(state, 1, 1)
  expect(result1).toBeDefined()
  expect(result1?.id).toBe(1)
  expect(result1?.title).toBe('File 1')

  const result2 = findTabInState(state, 2, 2)
  expect(result2).toBeDefined()
  expect(result2?.id).toBe(2)
  expect(result2?.title).toBe('File 2')
})

// Tests for closeTabWithViewlet (lines 76-108)

test('closeTabWithViewlet should close tab without viewlet', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
    'Viewlet.create': async () => {},
    'Viewlet.attachToDom': async () => {},
    'Viewlet.setBounds': async () => {},
  })

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

  const result = await closeTabWithViewlet(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('closeTabWithViewlet should close active tab and switch viewlet to new active tab', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
    'Viewlet.create': async () => {},
    'Viewlet.attachToDom': async () => {},
    'Viewlet.setBounds': async () => {},
  })

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
              editorUid: 100,
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

  const result = await closeTabWithViewlet(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 1)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(2)
})

test('closeTabWithViewlet should dispose viewlet when closing tab with editorUid', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
    'Viewlet.create': async () => {},
    'Viewlet.attachToDom': async () => {},
    'Viewlet.setBounds': async () => {},
  })

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
              editorUid: 100,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: 200,
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabWithViewlet(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('closeTabWithViewlet should handle closing the last tab', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
    'Viewlet.create': async () => {},
    'Viewlet.attachToDom': async () => {},
    'Viewlet.setBounds': async () => {},
  })

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
              editorUid: 100,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabWithViewlet(state, 1, 1)

  expect(result.layout.groups[0].tabs.length).toBe(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
})

test('closeTabWithViewlet should handle closing tab when tab not found', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
    'Viewlet.create': async () => {},
    'Viewlet.attachToDom': async () => {},
    'Viewlet.setBounds': async () => {},
  })

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

  const result = await closeTabWithViewlet(state, 1, 999)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('closeTabWithViewlet should handle closing non-active tab with viewlet', async () => {
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
              editorUid: 100,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: 200,
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: 300,
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabWithViewlet(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('closeTabWithViewlet should close active middle tab and switch to next tab', async () => {
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
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: 100,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: 200,
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
              editorUid: 300,
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabWithViewlet(state, 1, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs.find((tab) => tab.id === 2)).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(3)
})
