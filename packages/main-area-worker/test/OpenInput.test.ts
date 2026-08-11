import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { openInput, openInputWithContext } from '../src/parts/OpenInput/OpenInput.ts'

const isSetupInvocation = ([command]: readonly unknown[]): boolean => command !== 'Viewlet.getTitle' && command !== 'Layout.renderMainAreaPending'

afterEach(() => {
  MainAreaStates.clear()
  const defaultState = createDefaultState()
  MainAreaStates.set(0, defaultState, defaultState)
})

test('openInput should open editor input via Layout.getModuleId', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
  })

  const state = createDefaultState()

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: 'file:///path/to/file.ts',
    },
    focus: false,
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
  expect(mockRpc.invocations.filter(isSetupInvocation)).toEqual([
    ['Layout.getModuleId', 'file:///path/to/file.ts'],
    ['Layout.createViewlet', 'Editor', tab.editorUid, tab.id, { height: -35, width: 0, x: 0, y: 35 }, 'file:///path/to/file.ts'],
  ])
})

test('openInput should show a binary file placeholder without creating a viewlet', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state = createDefaultState()

  const result = await openInput(state, {
    editorInput: {
      type: 'binary',
      uri: 'file:///path/to/archive.zip',
    },
    focus: false,
    preview: false,
  })

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    editorInput: {
      type: 'binary',
      uri: 'file:///path/to/archive.zip',
    },
    editorType: 'custom',
    editorUid: -1,
    loadingState: 'binary',
    title: 'archive.zip',
    uri: 'file:///path/to/archive.zip',
  })
  expect(mockRpc.invocations).toEqual([])
})

test('openInput renders loaded editor content before the title request finishes', async () => {
  const title = Promise.withResolvers<string>()
  const titleRequested = Promise.withResolvers<void>()
  const rendered = Promise.withResolvers<void>()
  let state = createDefaultState()
  const context: AsyncCommandContext<MainAreaState> = {
    getState: () => state,
    updateState: (updater) => {
      state = updater(state)
      return Promise.resolve(state)
    },
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
    'Layout.renderMainAreaPending': async () => {
      const tab = state.layout.groups[0].tabs[0]
      expect(tab.loadingState).toBe('loaded')
      rendered.resolve()
    },
    'Viewlet.getTitle': async () => {
      titleRequested.resolve()
      return title.promise
    },
  })

  let settled = false
  const opening = (async (): Promise<void> => {
    await openInputWithContext(context, {
      editorInput: {
        type: 'editor',
        uri: 'file:///path/to/file.ts',
      },
      focus: false,
      preview: false,
    })
    settled = true
  })()

  await rendered.promise
  await titleRequested.promise
  expect(settled).toBe(false)
  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///path/to/file.ts'],
    ['Layout.createViewlet', 'Editor', expect.any(Number), expect.any(Number), { height: -35, width: 0, x: 0, y: 35 }, 'file:///path/to/file.ts'],
    ['Layout.renderMainAreaPending', state.uid],
    ['Viewlet.getTitle', expect.any(Number)],
  ])

  title.resolve('Rendered title')
  await opening

  expect(state.layout.groups[0].tabs[0].title).toBe('Rendered title')
})

test('openInput should add pretty uri title for file under home dir', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
  })

  const state = {
    ...createDefaultState(),
    homeDirUri: 'file:///home/user',
  }

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: 'file:///home/user/Documents/file.md',
    },
    focus: false,
    preview: false,
  })

  const tab = result.layout.groups[0].tabs[0]

  expect(tab.title).toBe('file.md')
  expect(tab.uriTitle).toBe('~/Documents/file.md')
  expect(mockRpc.invocations.filter(isSetupInvocation)).toEqual([
    ['Layout.getModuleId', 'file:///home/user/Documents/file.md'],
    ['Layout.createViewlet', 'Editor', tab.editorUid, tab.id, { height: -35, width: 0, x: 0, y: 35 }, 'file:///home/user/Documents/file.md'],
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
    focus: false,
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
  expect(mockRpc.invocations.filter(isSetupInvocation)).toEqual([
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
    focus: false,
    preview: false,
  })

  const tab = result.layout.groups[0].tabs[0]

  expect(tab.editorInput).toEqual({
    extensionId: 'abc',
    type: 'extension-detail-view',
  })
  expect(tab.uri).toBe('extension-detail://abc')
  expect(tab.title).toBe('abc')
  expect(mockRpc.invocations.filter(isSetupInvocation)).toEqual([
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
          direction: 1,
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
    focus: false,
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
    focus: false,
    preview: false,
  })

  const tab = result.layout.groups[0].tabs[0]

  expect(tab.loadingState).toBe('error')
  expect(tab.errorMessage).toBe('Expected a file but received a folder')
  expect(mockRpc.invocations.filter(isSetupInvocation)).toEqual([['FileSystem.stat', '/tmp/folder-to-open']])
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
          direction: 1,
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
    focus: false,
    preview: false,
  })

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(mockRpc.invocations.filter(isSetupInvocation)).toEqual([])
})

test('openInput should use default options and initialize missing stored state', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
  })
  const state = {
    ...createDefaultState(),
    uid: 99,
  }

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: 'file:///new.ts',
    },
    focus: false,
  })

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    isPreview: false,
    loadingState: 'loaded',
    uri: 'file:///new.ts',
  })
  expect(mockRpc.invocations.filter(isSetupInvocation)).toHaveLength(2)
})

test('openInput should expose an Error message when resolving the viewlet fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {
      throw new Error('module lookup failed')
    },
    'Layout.getModuleId': async () => 'Editor',
  })
  const state = {
    ...createDefaultState(),
    uid: 98,
  }

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: 'file:///failed.ts',
    },
    focus: false,
    preview: false,
  })

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    errorMessage: 'module lookup failed',
    loadingState: 'error',
  })
  expect(mockRpc.invocations.filter(isSetupInvocation)).toEqual([
    ['Layout.getModuleId', 'file:///failed.ts'],
    ['Layout.createViewlet', 'Editor', expect.any(Number), expect.any(Number), { height: -35, width: 0, x: 0, y: 35 }, 'file:///failed.ts'],
  ])
})

test('openInput should use a generic message for non-Error failures', async () => {
  RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {
      throw 'module lookup failed'
    },
    'Layout.getModuleId': async () => 'Editor',
  })
  const state = {
    ...createDefaultState(),
    uid: 97,
  }

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: 'file:///failed.ts',
    },
    focus: false,
    preview: false,
  })

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    errorMessage: 'Failed to open URI',
    loadingState: 'error',
  })
})
