import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { afterEach, expect, test } from '@jest/globals'
import { restoreJsonRpcError } from '@lvce-editor/json-rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { loadContentShell } from '../src/parts/LoadContent/LoadContentShell.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { openInput, openInputWithContext } from '../src/parts/OpenInput/OpenInput.ts'
import { updateTab } from '../src/parts/UpdateTab/UpdateTab.ts'

const isSetupInvocation = ([command]: readonly unknown[]): boolean =>
  command !== 'FileSystem.getFileSize' &&
  command !== 'Preferences.get' &&
  command !== 'Viewlet.getTitle' &&
  command !== 'Layout.renderMainAreaPending' &&
  command !== 'Viewlet.runLoadContentLater'

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
    [
      'Layout.createViewlet',
      'Editor',
      tab.editorUid,
      tab.id,
      { height: -35, width: 0, x: 0, y: 35 },
      'file:///path/to/file.ts',
      [{ deferLoadContentLater: true, focus: false }],
    ],
  ])
})

test('openInput resolves the file size and viewlet module ID in parallel', async () => {
  const fileSize = Promise.withResolvers<number>()
  const moduleIdRequested = Promise.withResolvers<void>()
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': () => fileSize.promise,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => {
      moduleIdRequested.resolve()
      return 'Editor'
    },
  })

  const opening = openInput(createDefaultState(), {
    editorInput: {
      type: 'editor',
      uri: 'file:///path/to/file.ts',
    },
    focus: false,
    preview: false,
  })

  await moduleIdRequested.promise
  expect(mockRpc.invocations).toContainEqual(['FileSystem.getFileSize', 'file:///path/to/file.ts'])
  expect(mockRpc.invocations).toContainEqual(['Layout.getModuleId', 'file:///path/to/file.ts'])

  fileSize.resolve(2)
  await opening
})

test('openInput should focus the opened editor when requested', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
    'Viewlet.focusSelector': async () => {},
  })

  const state = createDefaultState()

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: 'file:///path/to/file.ts',
    },
    focus: true,
    preview: true,
  })

  const tab = result.layout.groups[0].tabs[0]
  expect(mockRpc.invocations).toContainEqual(['Viewlet.focusSelector', tab.editorUid, '[name="editor"]'])
  expect(mockRpc.invocations).toContainEqual([
    'Layout.createViewlet',
    'Editor',
    tab.editorUid,
    tab.id,
    { height: -35, width: 0, x: 0, y: 35 },
    'file:///path/to/file.ts',
    [{ deferLoadContentLater: true, focus: true }],
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
    editorUid: -1,
    loadingState: 'binary',
    title: 'archive.zip',
    uri: 'file:///path/to/archive.zip',
  })
  expect(mockRpc.invocations).toEqual([])
})

test('openInput should show a large file placeholder without creating a viewlet', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': async () => 2 * 1024 * 1024,
    'Preferences.get': async () => 1,
  })
  const state = createDefaultState()

  const result = await openInput(state, {
    editorInput: {
      type: 'editor',
      uri: 'file:///path/to/large.txt',
    },
    focus: false,
    preview: false,
  })

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    editorUid: -1,
    fileSize: 2 * 1024 * 1024,
    loadingState: 'large',
  })
  expect(mockRpc.invocations).not.toContainEqual(expect.arrayContaining(['Layout.createViewlet']))
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
    ['FileSystem.getFileSize', 'file:///path/to/file.ts'],
    ['Preferences.get', 'files.maxFileSizeMB'],
    ['Layout.getModuleId', 'file:///path/to/file.ts'],
    [
      'Layout.createViewlet',
      'Editor',
      expect.any(Number),
      expect.any(Number),
      { height: -35, width: 0, x: 0, y: 35 },
      'file:///path/to/file.ts',
      [{ deferLoadContentLater: true, focus: false }],
    ],
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
    [
      'Layout.createViewlet',
      'Editor',
      tab.editorUid,
      tab.id,
      { height: -35, width: 0, x: 0, y: 35 },
      'file:///home/user/Documents/file.md',
      [{ deferLoadContentLater: true, focus: false }],
    ],
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
  expect(tab.uri).toBe('extension-detail:///abc')
  expect(tab.title).toBe('abc')
  expect(mockRpc.invocations.filter(isSetupInvocation)).toEqual([
    ['Layout.createViewlet', 'ExtensionDetail', tab.editorUid, tab.id, { height: -35, width: 0, x: 0, y: 35 }, 'extension-detail:///abc'],
  ])
})

test('openInput should activate and focus an existing diff editor tab when requested', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector': async () => {},
  })
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
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
                uriLeft: 'file:///path/to/left.ts',
                uriRight: 'file:///path/to/right.ts',
              },
              editorUid: 42,
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
    focus: true,
    preview: false,
  })

  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(mockRpc.invocations).toEqual([['Viewlet.focusSelector', 42, '[name="editor"]']])
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
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorInput: {
                type: 'editor',
                uri: 'file:///path/to/file.ts',
              },
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
    [
      'Layout.createViewlet',
      'Editor',
      expect.any(Number),
      expect.any(Number),
      { height: -35, width: 0, x: 0, y: 35 },
      'file:///failed.ts',
      [{ deferLoadContentLater: true, focus: false }],
    ],
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

test('confirmation opens the warned document with reduced features', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': async () => 60 * 1024 * 1024,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
    'Preferences.get': async () => 50,
  })
  const options = { editorInput: { type: 'editor' as const, uri: '/tmp/snapshot.heapsnapshot' }, focus: false }
  const warned = await openInput(createDefaultState(), options)
  expect(warned.layout.groups[0].tabs[0].loadingState).toBe('large')
  expect(mockRpc.invocations.some(([command]) => command === 'Layout.createViewlet')).toBe(false)
  const repeated = await openInput(warned, options)
  expect(repeated.layout.groups[0].tabs).toHaveLength(1)
  expect(mockRpc.invocations.some(([command]) => command === 'Layout.createViewlet')).toBe(false)
  await openInput(repeated, { ...options, forceOpen: true })
  expect(mockRpc.invocations.find(([command]) => command === 'Layout.createViewlet')?.at(-1)).toEqual([
    { deferLoadContentLater: true, focus: false, largeFile: true },
  ])
})

test('read-detected binary errors replace the failed viewlet with a reopen placeholder', async () => {
  const uri = 'file:///node_modules/esbuild/bin/esbuild'
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {
      throw restoreJsonRpcError({ data: { name: 'BinaryFileError', type: 'Error' }, message: 'Cannot open binary file' })
    },
    'Layout.getModuleId': async () => 'Editor',
    'Viewlet.dispose': async () => {},
  })
  const state = createDefaultState()
  const result = await openInput(state, { editorInput: { type: 'editor', uri }, focus: false, preview: true })
  const tab = result.layout.groups[0].tabs[0]
  expect(tab).toMatchObject({ editorInput: { type: 'binary', uri }, editorUid: -1, isPreview: true, loadingState: 'binary', uri })
  expect(tab.errorMessage).toBeUndefined()
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  const createCall = mockRpc.invocations.find(([command]) => command === 'Layout.createViewlet')!
  expect(mockRpc.invocations).toContainEqual(['Viewlet.dispose', createCall[2]])
})

test('initial providers start after attachment and focus without holding the open request', async () => {
  const attachment = Promise.withResolvers<void>()
  const attached = Promise.withResolvers<void>()
  const focus = Promise.withResolvers<void>()
  const focusing = Promise.withResolvers<void>()
  const provider = Promise.withResolvers<void>()
  let started = false
  using _rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
    'Layout.renderMainAreaPending': async () => {
      attached.resolve()
      await attachment.promise
    },
    'Viewlet.focusSelector': async () => {
      focusing.resolve()
      await focus.promise
    },
    'Viewlet.runLoadContentLater': async () => {
      started = true
      await provider.promise
    },
  })
  const opening = openInput(createDefaultState(), {
    editorInput: { type: 'editor', uri: 'file:///new.json' },
    focus: true,
    preview: false,
  })
  try {
    await attached.promise
    expect(started).toBe(false)
    attachment.resolve()
    await focusing.promise
    expect(started).toBe(false)
    focus.resolve()
    const result = await opening
    expect(result.layout.groups[0].tabs[0].loadingState).toBe('loaded')
    expect(started).toBe(true)
  } finally {
    attachment.resolve()
    focus.resolve()
    provider.resolve()
    await opening
  }
})

test.each([undefined, 'idle', 'loaded'] as const)(
  'openInput loads an inactive restored tab with loading state %s before activating it',
  async (loadingState) => {
    using mockRpc = RendererWorker.registerMockRpc({
      'Layout.createViewlet': async () => {},
      'Layout.getModuleId': async () => 'Editor',
    })
    const first = await openInput(createDefaultState(), { editorInput: { type: 'editor', uri: 'file:///LICENSE' }, focus: false })
    const second = await openInput(first, { editorInput: { type: 'editor', uri: 'file:///README.md' }, focus: false, preview: true })
    const shell = loadContentShell(createDefaultState(), { layout: second.layout })
    const restored = updateTab(shell, shell.layout.groups[0].tabs[0].id, { loadingState })
    MainAreaStates.set(restored.uid, restored, restored)

    const result = await openInput(restored, { editorInput: { type: 'editor', uri: 'file:///LICENSE' }, focus: false })

    const group = result.layout.groups[0]
    const tab = group.tabs.find((tab) => tab.uri === 'file:///LICENSE')!
    expect(group.tabs).toHaveLength(2)
    expect(group.activeTabId).toBe(tab.id)
    expect(tab.editorUid).toBeGreaterThanOrEqual(0)
    expect(tab.loadingState).toBe('loaded')
    expect(mockRpc.invocations.some(([command]) => command === 'Viewlet.dispose')).toBe(false)
    expect(mockRpc.invocations).toContainEqual([
      'Layout.createViewlet',
      'Editor',
      tab.editorUid,
      tab.id,
      { height: -35, width: 0, x: 0, y: 35 },
      'file:///LICENSE',
      [{ deferLoadContentLater: true, focus: false }],
    ])
  },
)
