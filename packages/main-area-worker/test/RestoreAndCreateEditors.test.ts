import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaLayout } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { restoreAndCreateEditors } from '../src/parts/LoadContent/RestoreAndCreateEditors.ts'

test('restoreAndCreateEditors should set layout from restoredLayout', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [
          {
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
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

  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///file.ts']])
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.direction).toBe(1)
  expect(result.layout.groups).toHaveLength(1)
})

test('restoreAndCreateEditors should handle empty groups', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: -1,
    direction: 1,
    groups: [],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => null,
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([])
  expect(result.layout.groups).toHaveLength(0)
})

test('restoreAndCreateEditors should skip tabs without uri', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [
          {
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'Untitled',
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

  expect(mockRpc.invocations).toEqual([])
  expect(result.layout.groups[0].tabs[0].editorUid).toBe(-1)
})

test('restoreAndCreateEditors should process only active tabs', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 2,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [
          {
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'File1.ts',
            uri: 'file:///file1.ts',
          },
          {
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            isPreview: false,
            title: 'File2.ts',
            uri: 'file:///file2.ts',
          },
        ],
      },
    ],
  }

  using _mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async (uri: string) => (uri.includes('file2') ? 'editor.text' : null),
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(result.layout.groups[0].tabs[0].editorUid).toBe(-1)
  expect(result.layout.groups[0].tabs[1].editorUid).not.toBe(-1)
})

test('restoreAndCreateEditors should preserve existing editorUid', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [
          {
            editorUid: 42,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'File.ts',
            uri: 'file:///file.ts',
          },
        ],
      },
    ],
  }

  using _mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(result.layout.groups[0].tabs[0].editorUid).toBe(42)
})

test('restoreAndCreateEditors should handle multiple groups', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: 2,
    direction: 2,
    groups: [
      {
        activeTabId: 1,
        direction: 2,
        id: 1,
        isEmpty: false,
        isFocused: false,
        size: 50,
        tabs: [
          {
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'File1.ts',
            uri: 'file:///file1.ts',
          },
        ],
      },
      {
        activeTabId: 2,
        direction: 2,
        id: 2,
        isEmpty: false,
        isFocused: true,
        size: 50,
        tabs: [
          {
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            isPreview: false,
            title: 'File2.ts',
            uri: 'file:///file2.ts',
          },
        ],
      },
    ],
  }

  using _mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].tabs[0].editorUid).not.toBe(-1)
  expect(result.layout.groups[1].tabs[0].editorUid).not.toBe(-1)
})

test('restoreAndCreateEditors should handle no matching viewlet module', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [
          {
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'Unknown.unknown',
            uri: 'file:///unknown.unknown',
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

  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///unknown.unknown']])
  expect(result.layout.groups[0].tabs[0].editorUid).toBe(-1)
})

test('restoreAndCreateEditors should maintain group structure', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 50,
        tabs: [
          {
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'File1.ts',
            uri: 'file:///file1.ts',
          },
        ],
      },
      {
        activeTabId: 2,
        direction: 1,
        id: 2,
        isEmpty: false,
        isFocused: false,
        size: 50,
        tabs: [
          {
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            isPreview: false,
            title: 'File2.ts',
            uri: 'file:///file2.ts',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///file1.ts'],
    ['Layout.getModuleId', 'file:///file2.ts'],
    [
      'Layout.createViewlet',
      'editor.text',
      expect.any(Number),
      1,
      { height: expect.any(Number), width: expect.any(Number), x: expect.any(Number), y: expect.any(Number) },
      'file:///file1.ts',
    ],
    ['Viewlet.getTitle', expect.any(Number)],
    [
      'Layout.createViewlet',
      'editor.text',
      expect.any(Number),
      2,
      { height: expect.any(Number), width: expect.any(Number), x: expect.any(Number), y: expect.any(Number) },
      'file:///file2.ts',
    ],
    ['Viewlet.getTitle', expect.any(Number)],
  ])
  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[1].id).toBe(2)
  expect(result.layout.direction).toBe(1)
})

test('restoreAndCreateEditors should restore diff editor inputs without Layout.getModuleId', async () => {
  const initialState = createDefaultState()
  const restoredLayout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [
          {
            editorInput: {
              type: 'diff-editor',
              uriLeft: 'file:///left.ts',
              uriRight: 'file:///right.ts',
            },
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'left.ts - right.ts',
            uri: 'diff://?left=file%3A%2F%2F%2Fleft.ts&right=file%3A%2F%2F%2Fright.ts',
          },
        ],
      },
    ],
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const result = await restoreAndCreateEditors(initialState, restoredLayout)

  expect(mockRpc.invocations).toEqual([
    [
      'Layout.createViewlet',
      'DiffEditor',
      expect.any(Number),
      1,
      { height: expect.any(Number), width: expect.any(Number), x: expect.any(Number), y: expect.any(Number) },
      'diff://?left=file%3A%2F%2F%2Fleft.ts&right=file%3A%2F%2F%2Fright.ts',
    ],
    ['Viewlet.getTitle', expect.any(Number)],
  ])
  expect(result.layout.groups[0].tabs[0].editorUid).not.toBe(-1)
})

test('hot reload recreates inactive drafts in every group without changing selection', async () => {
  const tabs = ['file:///saved.txt', 'untitled://1'].map((uri, index) => ({
    editorUid: -1,
    icon: '',
    id: index + 10,
    isDirty: true,
    isPreview: false,
    title: uri,
    uri,
  }))
  const layout: MainAreaLayout = {
    activeGroupId: 2,
    direction: 1,
    groups: [
      { activeTabId: 10, direction: 1, id: 1, isEmpty: false, isFocused: false, size: 50, tabs },
      {
        activeTabId: 30,
        direction: 1,
        id: 2,
        isEmpty: false,
        isFocused: true,
        size: 50,
        tabs: [{ editorUid: -1, icon: '', id: 30, isDirty: false, isPreview: false, title: 'file:///other.txt', uri: 'file:///other.txt' }],
      },
    ],
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'EditorText',
    'Viewlet.getTitle': async () => 'Draft',
  })
  const restored = await restoreAndCreateEditors(createDefaultState(), layout, true)
  expect(restored.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.editorUid))).toEqual([
    expect.any(Number),
    expect.any(Number),
    expect.any(Number),
  ])
  expect(restored.layout.activeGroupId).toBe(2)
  expect(restored.layout.groups.map((group) => group.activeTabId)).toEqual([10, 30])
  expect(mockRpc.invocations.filter((call) => call[0] === 'Layout.createViewlet').map((call) => call[5])).toEqual([
    ...tabs.map((tab) => tab.uri),
    'file:///other.txt',
  ])
})
