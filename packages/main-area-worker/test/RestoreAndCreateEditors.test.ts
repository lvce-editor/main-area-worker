import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { restoreAndCreateEditors } from '../src/parts/LoadContent/RestoreAndCreateEditors.ts'

test('restoreAndCreateEditors should set layout in state', async () => {
  const initialState = createDefaultState()
  const restoredLayout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            content: 'content',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File.ts',
            uri: 'file:///file.ts',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => null,
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(result.layout).toEqual(restoredLayout)
})

test('restoreAndCreateEditors should handle empty groups', async () => {
  const initialState = createDefaultState()
  const restoredLayout = {
    activeGroupId: undefined,
    direction: 'horizontal' as const,
    groups: [],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async () => null,
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([])
  expect(result.layout.groups).toHaveLength(0)
})

test('restoreAndCreateEditors should skip tabs without uri', async () => {
  const initialState = createDefaultState()
  const restoredLayout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            content: 'content',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'Untitled',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async () => null,
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([])
  expect(result.layout.groups[0].tabs[0].editorUid).toBe(-1)
})

test('restoreAndCreateEditors should only create viewlets for active tabs', async () => {
  const initialState = createDefaultState()
  const restoredLayout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 2,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            content: 'c1',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File1.ts',
            uri: 'file:///file1.ts',
          },
          {
            content: 'c2',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            title: 'File2.ts',
            uri: 'file:///file2.ts',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async (uri: string) => {
      return uri.includes('file2') ? 'editor.text' : null
    },
  })

  using mockRenderer = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///file1.ts'],
    ['Layout.getModuleId', 'file:///file2.ts'],
  ])
  expect(result.layout.groups[0].tabs[0].editorUid).toBe(-1)
  expect(result.layout.groups[0].tabs[1].editorUid).not.toBe(-1)
})

test('restoreAndCreateEditors should preserve editorUid when already set', async () => {
  const initialState = createDefaultState()
  const restoredLayout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            content: 'content',
            editorType: 'text' as const,
            editorUid: 42,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File.ts',
            uri: 'file:///file.ts',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async () => 'editor.text',
  })

  using mockRenderer = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///file.ts']])
  expect(result.layout.groups[0].tabs[0].editorUid).toBe(42)
})

test('restoreAndCreateEditors should handle multiple groups with different active tabs', async () => {
  const initialState = createDefaultState()
  const restoredLayout = {
    activeGroupId: 2,
    direction: 'vertical' as const,
    groups: [
      {
        activeTabId: 1,
        focused: false,
        id: 1,
        size: 50,
        tabs: [
          {
            content: 'c1',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File1.ts',
            uri: 'file:///file1.ts',
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
            content: 'c2',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            title: 'File2.ts',
            uri: 'file:///file2.ts',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async () => 'editor.text',
  })

  using mockRenderer = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///file1.ts'],
    ['Layout.getModuleId', 'file:///file2.ts'],
  ])
  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].tabs[0].editorUid).not.toBe(-1)
  expect(result.layout.groups[1].tabs[0].editorUid).not.toBe(-1)
})

test('restoreAndCreateEditors should handle tabs with no matching viewlet module', async () => {
  const initialState = createDefaultState()
  const restoredLayout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            content: 'content',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'Unknown.unknown',
            uri: 'file:///unknown.unknown',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async () => null,
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///unknown.unknown']])
  expect(result.layout.groups[0].tabs[0].editorUid).toBe(-1)
})

test('restoreAndCreateEditors should update group structure correctly', async () => {
  const initialState = createDefaultState()
  const restoredLayout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 50,
        tabs: [
          {
            content: 'c1',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File1.ts',
            uri: 'file:///file1.ts',
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
            content: 'c2',
            editorType: 'text' as const,
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            title: 'File2.ts',
            uri: 'file:///file2.ts',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async () => 'editor.text',
  })

  using mockRenderer = require('@lvce-editor/rpc-registry').RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///file1.ts'],
    ['Layout.getModuleId', 'file:///file2.ts'],
  ])
  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[1].id).toBe(2)
  expect(result.layout.direction).toBe('horizontal')
})
