import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleDrop } from '../src/parts/HandleDrop/HandleDrop.ts'

const registerDroppedUris = (uris: readonly string[]) => {
  return DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItems'() {
      return { files: [], strings: [], uris }
    },
  })
}

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
  using _dragRpc = registerDroppedUris([])
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
  using _dragRpc = registerDroppedUris(['file:///workspace/file.txt'])
  using _mockRpc = RendererWorker.registerMockRpc({})
  let state: MainAreaState = {
    ...createDefaultState(),
    dragOverlay: {
      height: 300,
      width: 500,
      x: 0,
      y: 0,
    },
    layout: {
      activeGroupId: -1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
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
  const uri = 'html:///dropped-files/1/1/native.txt'
  using dragRpc = registerDroppedUris([uri])
  using mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, [1])

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups[0].tabs[0].uri).toBe(uri)
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [1], false]])
  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', uri]])
})

test('opens a dropped native electron file using its file uri', async () => {
  using dragRpc = registerDroppedUris(['file:///workspace/native%20file.txt'])
  using mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
    platform: PlatformType.Electron,
  })

  await handleDrop(context, [1])

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups[0].tabs[0].uri).toBe('file:///workspace/native%20file.txt')
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [1], true]])
  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///workspace/native%20file.txt']])
})

test('sets a dropped native folder as the workspace folder', async () => {
  const workspaceUri = 'html:///dropped-files/1/1/native-folder/'
  using dragRpc = registerDroppedUris([workspaceUri])
  using mockRpc = RendererWorker.registerMockRpc({
    async 'Workspace.setPath'() {},
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, [1])

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toEqual([])
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [1], false]])
  expect(mockRpc.invocations).toEqual([['Workspace.setPath', workspaceUri]])
})

test('does not wait for a workspace reload after dropping a folder', async () => {
  const workspaceUri = 'html:///dropped-files/1/1/native-folder/'
  const workspaceReload = Promise.withResolvers<void>()
  const workspaceReloadStarted = Promise.withResolvers<void>()
  using _dragRpc = registerDroppedUris([workspaceUri])
  using _mockRpc = RendererWorker.registerMockRpc({
    async 'Workspace.setPath'() {
      workspaceReloadStarted.resolve()
      await workspaceReload.promise
    },
  })
  const { context } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })
  let dropCompleted = false

  const runDrop = async (): Promise<void> => {
    await handleDrop(context, [1])
    dropCompleted = true
  }
  const drop = runDrop()
  await workspaceReloadStarted.promise
  await new Promise<void>((resolve) => setTimeout(resolve, 0))
  const completedBeforeReload = dropCompleted
  workspaceReload.resolve()
  await drop

  expect(completedBeforeReload).toBe(true)
})

test('sets a dropped explorer folder as the workspace folder', async () => {
  const folderUri = 'file:///workspace/folder'
  using dragRpc = registerDroppedUris([folderUri])
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat'() {
      return DirentType.Directory
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
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [1], false]])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.stat', folderUri],
    ['Workspace.setUri', folderUri],
  ])
})

test('opens multiple dropped explorer uris in their source order', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/first.ts', 'file:///workspace/second.ts', 'file:///workspace/third.ts'])
  using _mockRpc = RendererWorker.registerMockRpc({})
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
  using dragRpc = registerDroppedUris(['file:///workspace/retained.ts'])
  using mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, [7])

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups[0].tabs[0].uri).toBe('file:///workspace/retained.ts')
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedItems', [7], false]])
  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///workspace/retained.ts']])
})

test('clears the drag overlay before a native drop lookup fails', async () => {
  const error = new Error('Failed to read native drop')
  using _dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItems'() {
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
  using _dragRpc = registerDroppedUris([])
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
