import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleDragOver } from '../src/parts/HandleDragOver/HandleDragOver.ts'
import { handleDrop } from '../src/parts/HandleDrop/HandleDrop.ts'

const registerDroppedUris = (uris: readonly string[]) => {
  return DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedUrisByDropId'() {
      return uris
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

const createStateWithOpenFile = (uri: string = 'file:///workspace/original.txt'): MainAreaState => {
  const title = uri.slice(uri.lastIndexOf('/') + 1)
  return {
    ...createDefaultState(),
    height: 600,
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorInput: {
                type: 'editor',
                uri,
              },
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title,
              uri,
            },
          ],
        },
      ],
    },
    width: 800,
  }
}

const createStateWithTwoOpenFiles = (): MainAreaState => {
  return {
    ...createDefaultState(),
    height: 600,
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorInput: {
                type: 'editor',
                uri: 'file:///workspace/left.txt',
              },
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'left.txt',
              uri: 'file:///workspace/left.txt',
            },
          ],
        },
        {
          activeTabId: 4,
          direction: 1,
          focused: false,
          id: 3,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorInput: {
                type: 'editor',
                uri: 'file:///workspace/right.txt',
              },
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              isPreview: false,
              title: 'right.txt',
              uri: 'file:///workspace/right.txt',
            },
          ],
        },
      ],
    },
    width: 800,
  }
}

const createStateWithTwoTabs = (): MainAreaState => {
  const state = createStateWithOpenFile('/workspace/first.txt')
  return {
    ...state,
    layout: {
      ...state.layout,
      groups: [
        {
          ...state.layout.groups[0],
          activeTabId: 3,
          tabs: [
            state.layout.groups[0].tabs[0],
            {
              editorInput: {
                type: 'editor',
                uri: '/workspace/second.txt',
              },
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              isPreview: false,
              title: 'second.txt',
              uri: '/workspace/second.txt',
            },
          ],
        },
      ],
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

  await handleDrop(context, 1)

  expect(state.dragOverlay).toBeUndefined()
})

test('resolves an opt-in drop session by id', async () => {
  using dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedUrisByDropId'() {
      return []
    },
  })
  const { context } = createContext(createDefaultState())

  await handleDrop(context, 17)

  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 17, false]])
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

  await handleDrop(context, 1)

  expect(state.dragOverlay).toBeUndefined()
  expect(state.layout.activeGroupId).toBe(1)
  expect(state.layout.groups[0].activeTabId).toBe(2)
  expect(state.layout.groups[0].focused).toBe(true)
})

test.each([
  ['left', 100, 300, 1, [['file:///workspace/dropped.txt'], ['file:///workspace/original.txt']], 0],
  ['right', 700, 300, 1, [['file:///workspace/original.txt'], ['file:///workspace/dropped.txt']], 1],
  ['up', 400, 100, 2, [['file:///workspace/dropped.txt'], ['file:///workspace/original.txt']], 0],
  ['down', 400, 550, 2, [['file:///workspace/original.txt'], ['file:///workspace/dropped.txt']], 1],
])(
  'opens a dropped explorer uri in a new group when the drag overlay indicates a %s split',
  async (_name, eventX, eventY, expectedDirection, expectedUris, expectedActiveGroupIndex) => {
    using _dragRpc = registerDroppedUris(['file:///workspace/dropped.txt'])
    using _mockRpc = RendererWorker.registerMockRpc({})
    const { context, getState } = createContext(handleDragOver(createStateWithOpenFile(), eventX, eventY))

    await handleDrop(context, 1)

    expect(getState().dragOverlay).toBeUndefined()
    expect(getState().layout.direction).toBe(expectedDirection)
    expect(getState().layout.groups).toHaveLength(2)
    expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual(expectedUris)
    expect(getState().layout.activeGroupId).toBe(getState().layout.groups[expectedActiveGroupIndex].id)
  },
)

test('opens a center-dropped explorer uri in the existing group', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/dropped.txt'])
  using _mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext(handleDragOver(createStateWithOpenFile(), 400, 300))

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toHaveLength(1)
  expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual([
    ['file:///workspace/original.txt', 'file:///workspace/dropped.txt'],
  ])
})

test('opens a center-dropped explorer uri in the editor group under the pointer', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/dropped.txt'])
  using _mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext(handleDragOver(createStateWithTwoOpenFiles(), 600, 300))

  await handleDrop(context, 1)

  expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual([
    ['file:///workspace/left.txt'],
    ['file:///workspace/right.txt', 'file:///workspace/dropped.txt'],
  ])
  expect(getState().layout.activeGroupId).toBe(3)
})

test('splits the editor group under the pointer when dropping on its right edge', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/dropped.txt'])
  using _mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext(handleDragOver(createStateWithTwoOpenFiles(), 790, 300))

  await handleDrop(context, 1)

  expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual([
    ['file:///workspace/left.txt'],
    ['file:///workspace/right.txt'],
    ['file:///workspace/dropped.txt'],
  ])
  expect(getState().layout.activeGroupId).toBe(getState().layout.groups[2].id)
})

test('opens a dropped explorer uri without splitting for an unknown overlay direction', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/dropped.txt'])
  using _mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext({
    ...createStateWithOpenFile(),
    dragOverlay: {
      height: 600,
      splitDirection: 99,
      width: 800,
      x: 0,
      y: 0,
    },
  })

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toHaveLength(1)
  expect(getState().layout.groups[0].tabs.map((tab) => tab.uri)).toEqual(['file:///workspace/original.txt', 'file:///workspace/dropped.txt'])
})

test('opens an already-open explorer uri in the new split group', async () => {
  const uri = 'file:///workspace/original.txt'
  using _dragRpc = registerDroppedUris([uri])
  using _mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext(handleDragOver(createStateWithOpenFile(uri), 700, 300))

  await handleDrop(context, 1)

  expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual([[uri], [uri]])
  expect(getState().layout.activeGroupId).toBe(getState().layout.groups[1].id)
})

test('moves an internally dragged tab into the new split group', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/first.txt'])
  const initialState = {
    ...createStateWithTwoTabs(),
    pointerDownGroupIndex: 0,
    pointerDownTabIndex: 0,
  }
  const { context, getState } = createContext(handleDragOver(initialState, 700, 300))

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual([['/workspace/second.txt'], ['/workspace/first.txt']])
  expect(getState().layout.activeGroupId).toBe(getState().layout.groups[1].id)
  expect(getState().pointerDownGroupIndex).toBe(-1)
  expect(getState().pointerDownTabIndex).toBe(-1)
})

test('does not split when the only open editor is internally dragged to an edge', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/original.txt'])
  const initialState = {
    ...createStateWithOpenFile('/workspace/original.txt'),
    pointerDownGroupIndex: 0,
    pointerDownTabIndex: 0,
  }
  const { context, getState } = createContext(handleDragOver(initialState, 700, 300))

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toHaveLength(1)
  expect(getState().layout.groups[0].tabs.map((tab) => tab.uri)).toEqual(['/workspace/original.txt'])
  expect(getState().pointerDownGroupIndex).toBe(-1)
  expect(getState().pointerDownTabIndex).toBe(-1)
})

test('does not move an internally dragged tab when it is dropped in its current group', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/first.txt'])
  const initialState = {
    ...createStateWithTwoTabs(),
    pointerDownGroupIndex: 0,
    pointerDownTabIndex: 0,
  }
  const { context, getState } = createContext(handleDragOver(initialState, 400, 300))

  await handleDrop(context, 1)

  expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual([['/workspace/first.txt', '/workspace/second.txt']])
  expect(getState().pointerDownGroupIndex).toBe(-1)
  expect(getState().pointerDownTabIndex).toBe(-1)
})

test('does not move an internally dragged tab when there is no drop target', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/first.txt'])
  const initialState = {
    ...createStateWithTwoTabs(),
    pointerDownGroupIndex: 0,
    pointerDownTabIndex: 0,
  }
  const { context, getState } = createContext(initialState)

  await handleDrop(context, 1)

  expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual([['/workspace/first.txt', '/workspace/second.txt']])
  expect(getState().pointerDownGroupIndex).toBe(-1)
  expect(getState().pointerDownTabIndex).toBe(-1)
})

test('opens multiple dropped explorer uris in the new split group in source order', async () => {
  const uris = ['file:///workspace/first.ts', 'file:///workspace/second.ts', 'file:///workspace/third.ts']
  using _dragRpc = registerDroppedUris(uris)
  using _mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext(handleDragOver(createStateWithOpenFile(), 700, 300))

  await handleDrop(context, 1)

  expect(getState().layout.groups.map((group) => group.tabs.map((tab) => tab.uri))).toEqual([['file:///workspace/original.txt'], uris])
})

test('opens a dropped native file using its persisted html uri', async () => {
  const uri = 'html:///dropped-files/1/1/native.txt'
  using dragRpc = registerDroppedUris([uri])
  using mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups[0].tabs[0].uri).toBe(uri)
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 1, false]])
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

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups[0].tabs[0].uri).toBe('file:///workspace/native%20file.txt')
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 1, true]])
  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///workspace/native%20file.txt']])
})

test('sets a dropped native folder as the workspace folder', async () => {
  const workspaceUri = 'html:///dropped-files/1/1/native-folder/'
  using dragRpc = registerDroppedUris([workspaceUri])
  using mockRpc = RendererWorker.registerMockRpc({
    async 'Workspace.setUri'() {},
  })
  const { context, getState } = createContext(handleDragOver({ ...createDefaultState(), height: 600, width: 800 }, 0, 300))

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toEqual([])
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 1, false]])
  expect(mockRpc.invocations).toEqual([['Workspace.setUri', workspaceUri]])
})

test('sets a dropped folder path as the workspace folder', async () => {
  const workspacePath = '/home/test/about-view'
  using dragRpc = registerDroppedUris([workspacePath])
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat'() {
      return DirentType.Directory
    },
    async 'Workspace.setPath'() {},
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toEqual([])
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 1, false]])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.stat', workspacePath],
    ['Workspace.setPath', workspacePath],
  ])
})

test('does not wait for a workspace reload after dropping a folder', async () => {
  const workspaceUri = 'html:///dropped-files/1/1/native-folder/'
  const workspaceReload = Promise.withResolvers<void>()
  const workspaceReloadStarted = Promise.withResolvers<void>()
  using _dragRpc = registerDroppedUris([workspaceUri])
  using _mockRpc = RendererWorker.registerMockRpc({
    async 'Workspace.setUri'() {
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
    await handleDrop(context, 1)
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

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toEqual([])
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 1, false]])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.stat', folderUri],
    ['Workspace.setUri', folderUri],
  ])
})

test('sets a dropped remote explorer folder uri as the workspace folder', async () => {
  const folderUri = 'remote-ssh://test-host/home/test/about-view'
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

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toEqual([])
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 1, false]])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.stat', folderUri],
    ['Workspace.setUri', folderUri],
  ])
})

test('preserves the uri scheme when a dropped remote explorer folder has a trailing slash', async () => {
  const folderUri = 'remote-ssh://test-host/home/test/about-view/'
  using dragRpc = registerDroppedUris([folderUri])
  using mockRpc = RendererWorker.registerMockRpc({
    async 'Workspace.setUri'() {},
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, 1)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups).toEqual([])
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 1, false]])
  expect(mockRpc.invocations).toEqual([['Workspace.setUri', folderUri]])
})

test('opens multiple dropped explorer uris in their source order', async () => {
  using _dragRpc = registerDroppedUris(['file:///workspace/first.ts', 'file:///workspace/second.ts', 'file:///workspace/third.ts'])
  using _mockRpc = RendererWorker.registerMockRpc({})
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await handleDrop(context, 1)

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

  await handleDrop(context, 7)

  expect(getState().dragOverlay).toBeUndefined()
  expect(getState().layout.groups[0].tabs[0].uri).toBe('file:///workspace/retained.ts')
  expect(dragRpc.invocations).toEqual([['DragAndDrop.getDroppedUrisByDropId', 7, false]])
  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///workspace/retained.ts']])
})

test('clears the drag overlay before a native drop lookup fails', async () => {
  const error = new Error('Failed to read native drop')
  using _dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedUrisByDropId'() {
      throw error
    },
  })
  const { context, getState } = createContext({
    ...createDefaultState(),
    dragOverlay: { height: 300, width: 400, x: 0, y: 0 },
  })

  await expect(handleDrop(context, 1)).rejects.toThrow(error)

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

  await handleDrop(context, 1)

  expect(getState()).toEqual({
    ...initialState,
    dragOverlay: undefined,
  })
})
