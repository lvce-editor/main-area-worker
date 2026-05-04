import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { openInput } from '../src/parts/OpenInput/OpenInput.ts'

afterEach(() => {
  const defaultState = createDefaultState()
  MainAreaStates.set(0, defaultState, defaultState)
})

test('openInput should open editor input via Layout.getModuleId', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const state = createDefaultState()

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: 'file:///path/to/file.ts',
    },
    focu: false,
    preview: false,
  })

  const tab = result.layout.groups[0].tabs[0]

  expect(result.layout.groups).toHaveLength(1)
  expect(tab.editorInput).toEqual({
    type: 'editor',
    uri: 'file:///path/to/file.ts',
  })
  expect(tab.uri).toBe('file:///path/to/file.ts')
  expect(tab.title).toBe('file.ts')
  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///path/to/file.ts'],
    ['Layout.createViewlet', 'editor.text', tab.editorUid, tab.id, { height: -35, width: 0, x: 0, y: 35 }, 'file:///path/to/file.ts'],
  ])
})

test('openInput should open diff editor input without Layout.getModuleId', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const state = createDefaultState()

  const result = await openInput(state, {
    editorInput: {
      type: 'diff-editor',
      uriLeft: 'file:///path/to/left.ts',
      uriRight: 'file:///path/to/right.ts',
    },
    focu: false,
    preview: false,
  })

  const tab = result.layout.groups[0].tabs[0]

  expect(tab.editorInput).toEqual({
    type: 'diff-editor',
    uriLeft: 'file:///path/to/left.ts',
    uriRight: 'file:///path/to/right.ts',
  })
  expect(tab.uri).toBe('diff://?left=file%3A%2F%2F%2Fpath%2Fto%2Fleft.ts&right=file%3A%2F%2F%2Fpath%2Fto%2Fright.ts')
  expect(tab.title).toBe('left.ts - right.ts')
  expect(mockRpc.invocations).toEqual([
    [
      'Layout.createViewlet',
      'DiffEditor',
      tab.editorUid,
      tab.id,
      { height: -35, width: 0, x: 0, y: 35 },
      'diff://?left=file%3A%2F%2F%2Fpath%2Fto%2Fleft.ts&right=file%3A%2F%2F%2Fpath%2Fto%2Fright.ts',
    ],
  ])
})

test('openInput should open extension detail view input without Layout.getModuleId', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const state = createDefaultState()

  const result = await openInput(state, {
    editorInput: {
      extensionId: 'abc',
      type: 'extension-detail-view',
    },
    focu: false,
    preview: false,
  })

  const tab = result.layout.groups[0].tabs[0]

  expect(tab.editorInput).toEqual({
    extensionId: 'abc',
    type: 'extension-detail-view',
  })
  expect(tab.uri).toBe('extension-detail://abc')
  expect(tab.title).toBe('abc')
  expect(mockRpc.invocations).toEqual([
    ['Layout.createViewlet', 'ExtensionDetail', tab.editorUid, tab.id, { height: -35, width: 0, x: 0, y: 35 }, 'extension-detail://abc'],
  ])
})

test('openInput should activate existing diff editor tab', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorInput: {
                type: 'diff-editor',
                uriLeft: 'file:///path/to/left.ts',
                uriRight: 'file:///path/to/right.ts',
              },
              editorType: 'custom',
              editorUid: -1,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              language: '',
              loadingState: 'idle',
              title: 'left.ts - right.ts',
              uri: 'diff://?left=file%3A%2F%2F%2Fpath%2Fto%2Fleft.ts&right=file%3A%2F%2F%2Fpath%2Fto%2Fright.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await openInput(state, {
    editorInput: {
      type: 'diff-editor',
      uriLeft: 'file:///path/to/left.ts',
      uriRight: 'file:///path/to/right.ts',
    },
    focu: false,
    preview: false,
  })

  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('openInput should show an error when opening a folder path', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat': async () => DirentType.Directory,
  })

  const state = createDefaultState()

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: '/tmp/folder-to-open',
    },
    focu: false,
    preview: false,
  })

  const tab = result.layout.groups[0].tabs[0]

  expect(tab.loadingState).toBe('error')
  expect(tab.errorMessage).toBe('Expected a file but received a folder')
  expect(mockRpc.invocations).toEqual([['FileSystem.stat', '/tmp/folder-to-open']])
})

test('openInput should activate an existing stored tab when the call-site state is stale', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

  const staleState = createDefaultState()
  const storedState: MainAreaState = {
    ...staleState,
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorInput: {
                type: 'editor',
                uri: 'file:///path/to/file.ts',
              },
              editorType: 'text',
              editorUid: 1,
              errorMessage: '',
              icon: 'file-icon',
              id: 1,
              isDirty: false,
              isPreview: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file.ts',
              uri: 'file:///path/to/file.ts',
            },
          ],
        },
      ],
    },
  }

  MainAreaStates.set(staleState.uid, staleState, storedState)

  const result = await openInput(staleState, {
    editorInput: {
      type: 'editor',
      uri: 'file:///path/to/file.ts',
    },
    focu: false,
    preview: false,
  })

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(mockRpc.invocations).toEqual([])
})
