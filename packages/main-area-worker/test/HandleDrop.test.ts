import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleDrop } from '../src/parts/HandleDrop/HandleDrop.ts'

const nativeDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/1\/native\.txt$/
const nativeDroppedFolderUriRegex = /^html:\/\/\/dropped-files\/\d+\/1\/native-folder\/$/

const createContext = (initialState: MainAreaState) => {
  let state = initialState
  const context: AsyncCommandContext<MainAreaState> = {
    getState() {
      return state
    },
    async updateState(updater) {
      state = updater(state)
      return state
    },
  }
  return {
    context,
    getState() {
      return state
    },
  }
}

test('clears the drag overlay when no uri is dropped', async () => {
  let state: MainAreaState = {
    ...createDefaultState(),
    dragOverlay: {
      height: 300,
      width: 500,
      x: 0,
      y: 0,
    },
  }
  const context: AsyncCommandContext<MainAreaState> = {
    getState() {
      return state
    },
    async updateState(updater) {
      state = updater(state)
      return state
    },
  }

  await handleDrop(context, [])

  expect(state.dragOverlay).toBeUndefined()
})

test('opens a dropped explorer uri', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'string',
          type: 'text/uri-list',
          value: 'file:///workspace/file.txt',
        },
      ] as any
    },
  })
  let state: MainAreaState = {
    ...createDefaultState(),
    dragOverlay: {
      height: 300,
      width: 500,
      x: 0,
      y: 0,
    },
    layout: {
      activeGroupId: undefined,
      direction: 1,
      groups: [
        {
          activeTabId: undefined,
          direction: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorInput: {
                type: 'editor',
                uri: 'file:///workspace/file.txt',
              },
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'file.txt',
              uri: 'file:///workspace/file.txt',
            },
          ],
        },
      ],
    },
  }
  const context: AsyncCommandContext<MainAreaState> = {
    getState() {
      return state
    },
    async updateState(updater) {
      state = updater(state)
      return state
    },
  }

  await handleDrop(context, [1])

  expect(state.dragOverlay).toBeUndefined()
  expect(state.layout.activeGroupId).toBe(1)
  expect(state.layout.groups[0].activeTabId).toBe(2)
  expect(state.layout.groups[0].focused).toBe(true)
})

test('opens a dropped native file using its persisted html uri', async () => {
  const fileHandle = { kind: 'file', name: 'native.txt' }
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'file', type: 'text/plain', value: fileHandle }] as any
    },
    'PersistentFileHandle.addHandle'() {},
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, [1])

  expect(getState().dragOverlay).toBeUndefined()
  const [{ uri }] = getState().layout.groups[0].tabs
  expect(uri).toMatch(nativeDroppedFileUriRegex)
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1]],
    ['PersistentFileHandle.addHandle', uri, fileHandle],
    ['Layout.getModuleId', uri],
  ])
})

test('sets a dropped native folder as the workspace folder', async () => {
  const directoryHandle = { kind: 'directory', name: 'native-folder' }
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'file', type: '', value: directoryHandle }] as any
    },
    'PersistentFileHandle.addHandle'() {},
    async 'Workspace.setPath'() {},
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, [1])

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toEqual([])
  const workspaceUri = mockRpc.invocations[2][1]
  expect(workspaceUri).toMatch(nativeDroppedFolderUriRegex)
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1]],
    ['PersistentFileHandle.addHandle', workspaceUri, directoryHandle],
    ['Workspace.setPath', workspaceUri],
  ])
})

test('sets a dropped explorer folder as the workspace folder', async () => {
  const folderUri = 'file:///workspace/folder'
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat'() {
      return DirentType.Directory
    },
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'string', type: 'text/uri-list', value: folderUri }] as any
    },
    async 'Workspace.setUri'() {},
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, [1])

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toEqual([])
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1]],
    ['FileSystem.stat', folderUri],
    ['Workspace.setUri', folderUri],
  ])
})

test('opens multiple dropped explorer uris in their source order', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'string',
          type: 'text/uri-list',
          value: 'file:///workspace/first.ts\nfile:///workspace/second.ts\nfile:///workspace/third.ts',
        },
      ] as any
    },
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, [1])

  expect(getState().layout.groups[0].tabs.map((tab) => tab.uri)).toEqual([
    'file:///workspace/first.ts',
    'file:///workspace/second.ts',
    'file:///workspace/third.ts',
  ])
  expect(getState().layout.groups[0].activeTabId).toBe(getState().layout.groups[0].tabs[2].id)
})

test('opens an explorer file recovered from retained Chromium drag data', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'string', type: '', value: '8B1BC632EA890FDD4BDB7705EF0231B0' }] as any
    },
    'Viewlet.getDragData'() {
      return {
        items: [{ data: 'file:///workspace/retained.ts', type: 'text/uri-list' }],
      }
    },
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, [7])

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups[0].tabs[0].uri).toBe('file:///workspace/retained.ts')
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [7]],
    ['Viewlet.getDragData'],
    ['Layout.getModuleId', 'file:///workspace/retained.ts'],
  ])
})

test('clears the drag overlay before a native drop lookup fails', async () => {
  const error = new Error('Failed to read native drop')
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      throw error
    },
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await expect(handleDrop(context, [1])).rejects.toThrow(error)

  expect(getState().dragOverlay).toBeUndefined()
})

test('keeps the cancelled state when dropped data is unsupported', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'string', type: 'text/plain', value: 'not a uri list' }] as any
    },
  })
  const initialState = {
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
    uid: 23,
  }
  const { context, getState } = createContext(initialState)

  await handleDrop(context, [1])

  expect(getState()).toEqual({
    ...initialState,
    dragOverlay: undefined,
  })
})
