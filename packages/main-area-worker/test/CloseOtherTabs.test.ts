import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeOtherTabs } from '../src/parts/CloseOtherTabs/CloseOtherTabs.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeOtherTabs should close all tabs except the active one', () => {
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
              isDirty: false,
              title: 'File 2',
            },
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
  }

  const result = closeOtherTabs(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeOtherTabs should return state unchanged when group does not exist', () => {
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
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeOtherTabs(state, 999)

  expect(result).toBe(state)
})

test('closeOtherTabs should return state unchanged when there is no active tab', () => {
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
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeOtherTabs(state, 1)

  expect(result).toBe(state)
})

test('closeOtherTabs should preserve other groups', () => {
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
              isDirty: false,
              title: 'File 2',
            },
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
          activeTabId: 5,
          focused: false,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'content4',
              editorUid: -1,
              editorType: 'text' as const,
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
            {
              content: 'content5',
              editorUid: -1,
              editorType: 'text' as const,
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
            {
              content: 'content6',
              editorUid: -1,
              editorType: 'text' as const,
              id: 6,
              isDirty: false,
              title: 'File 6',
            },
          ],
        },
      ],
    },
  }

  const result = closeOtherTabs(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.groups[1].tabs.length).toBe(3)
  expect(result.layout.groups[1].tabs[0].id).toBe(4)
  expect(result.layout.groups[1].tabs[1].id).toBe(5)
  expect(result.layout.groups[1].tabs[2].id).toBe(6)
})

test('closeOtherTabs should handle single tab in group', () => {
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
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = closeOtherTabs(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('closeOtherTabs should handle active tab at the beginning', () => {
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
              isDirty: false,
              title: 'File 2',
            },
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
  }

  const result = closeOtherTabs(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('closeOtherTabs should handle active tab at the end', () => {
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
              isDirty: false,
              title: 'File 2',
            },
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
  }

  const result = closeOtherTabs(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(3)
  expect(result.layout.groups[0].activeTabId).toBe(3)
})

test('closeOtherTabs should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test',
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

  const result = closeOtherTabs(state, 1)

  expect(result.assetDir).toBe('/test')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(123)
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.direction).toBe('horizontal')
})

test('closeOtherTabs should handle tabs with custom properties', () => {
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
              editorUid: -1,
              editorType: 'text' as const,
              id: 1,
              isDirty: true,
              language: 'typescript',
              uri: '/file1.ts',
              title: 'File 1',
            },
            {
              content: 'content2',
              customEditorId: 'custom-editor',
              editorUid: -1,
              editorType: 'custom' as const,
              id: 2,
              isDirty: false,
              language: 'javascript',
              uri: '/file2.js',
              title: 'File 2',
            },
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
  }

  const result = closeOtherTabs(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.groups[0].tabs[0].customEditorId).toBe('custom-editor')
  expect(result.layout.groups[0].tabs[0].editorType).toBe('custom')
  expect(result.layout.groups[0].tabs[0].language).toBe('javascript')
  expect(result.layout.groups[0].tabs[0].uri).toBe('/file2.js')
})
