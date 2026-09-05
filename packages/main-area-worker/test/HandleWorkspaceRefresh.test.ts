import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorInput } from '../src/parts/EditorInput/EditorInput.ts'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceRefresh, handleWorkspaceRefreshWithContext } from '../src/parts/HandleWorkspaceRefresh/HandleWorkspaceRefresh.ts'

const createTab = (id: number, editorInput: EditorInput, uri: string, editorUid = id): Tab => ({
  editorInput,
  editorType: editorInput.type === 'editor' ? 'text' : 'custom',
  editorUid,
  icon: '',
  id,
  isDirty: false,
  isPreview: false,
  loadingState: 'loaded',
  title: uri,
  uri,
})

test('closes missing text file tabs and preserves existing tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
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
                type: 'editor' as const,
                uri: '/workspace/deleted.ts',
              },
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'deleted.ts',
              uri: '/workspace/deleted.ts',
            },
            {
              editorInput: {
                type: 'editor' as const,
                uri: '/workspace/existing.ts',
              },
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'existing.ts',
              uri: '/workspace/existing.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state, {
    deleted: ['/workspace/deleted.ts'],
  })

  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([2])
})

test('ignores non-text editor inputs', async () => {
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
                type: 'image' as const,
                uri: '/workspace/image.png',
              },
              editorType: 'custom' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'image.png',
              uri: '/workspace/image.png',
            },
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state, ['/workspace/image.png'])

  expect(result).toBe(state)
})

test('preserves text file tabs when no files were deleted', async () => {
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
                type: 'editor' as const,
                uri: '/workspace/file.ts',
              },
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'file.ts',
              uri: '/workspace/file.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state)

  expect(result).toBe(state)
})

test('supports the legacy deleted uri array', async () => {
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
                type: 'editor',
                uri: '/workspace/deleted.ts',
              },
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'deleted.ts',
              uri: '/workspace/deleted.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state, ['/workspace/deleted.ts'])

  expect(result.layout.groups).toEqual([])
})

test('retargets open files below a renamed folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.handleUriChange'() {},
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
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorInput: {
                type: 'editor',
                uri: '/workspace/old/src/file.ts',
              },
              editorUid: 42,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'file.ts',
              uri: '/workspace/old/src/file.ts',
            },
            {
              editorInput: {
                type: 'editor',
                uri: '/workspace/old-sibling/file.ts',
              },
              editorUid: 43,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'file.ts',
              uri: '/workspace/old-sibling/file.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state, {
    renamed: [['/workspace/old', '/workspace/new']],
  })

  expect(result.layout.groups[0].tabs[0].uri).toBe('/workspace/new/src/file.ts')
  expect(result.layout.groups[0].tabs[0].editorInput).toEqual({
    type: 'editor',
    uri: '/workspace/new/src/file.ts',
  })
  expect(result.layout.groups[0].tabs[1].uri).toBe('/workspace/old-sibling/file.ts')
  expect(mockRpc.invocations).toEqual([['Editor.handleUriChange', 42, '/workspace/new/src/file.ts']])
})

test('reloads matching text, diff, image, video, and webview editors', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.reload'() {},
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
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            createTab(1, { type: 'editor', uri: '/workspace/file.ts' }, '/workspace/file.ts'),
            createTab(2, { type: 'diff-editor', uriLeft: '/workspace/left.ts', uriRight: '/workspace/right.ts' }, 'diff://left-and-right'),
            createTab(3, { type: 'image', uri: '/workspace/image.png' }, '/workspace/image.png'),
            createTab(4, { type: 'video', uri: '/workspace/video.mp4' }, '/workspace/video.mp4'),
            createTab(5, { providerId: 'preview', type: 'webview', uri: '/workspace/document.md' }, '/workspace/document.md'),
            createTab(6, { type: 'editor', uri: '/workspace/unchanged.ts' }, '/workspace/unchanged.ts'),
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state, {
    changed: ['/workspace/file.ts', '/workspace/right.ts', '/workspace/image.png', '/workspace/video.mp4', '/workspace/document.md'],
  })

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([
    ['Viewlet.reload', 1],
    ['Viewlet.reload', 2],
    ['Viewlet.reload', 3],
    ['Viewlet.reload', 4],
    ['Viewlet.reload', 5],
  ])
})

test('does not reload an editor that has no renderer instance', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.reload'() {},
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
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, { type: 'editor', uri: '/workspace/file.ts' }, '/workspace/file.ts', -1)],
        },
      ],
    },
  }

  await handleWorkspaceRefresh(state, {
    changed: ['/workspace/file.ts'],
  })

  expect(mockRpc.invocations).toEqual([])
})

test('preserves a rename when an overlapping refresh finishes later', async () => {
  const editorUriChangeStarted = Promise.withResolvers<void>()
  const releaseEditorUriChange = Promise.withResolvers<void>()
  const reloadStarted = Promise.withResolvers<void>()
  const releaseReload = Promise.withResolvers<void>()
  using _mockRpc = RendererWorker.registerMockRpc({
    async 'Editor.handleUriChange'() {
      editorUriChangeStarted.resolve()
      await releaseEditorUriChange.promise
    },
    async 'Viewlet.reload'() {
      reloadStarted.resolve()
      await releaseReload.promise
    },
  })
  let currentState: MainAreaState = {
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
          tabs: [createTab(1, { type: 'editor', uri: '/workspace/original.txt' }, '/workspace/original.txt', 42)],
        },
      ],
    },
    uid: 1,
  }
  const context = {
    getState() {
      return currentState
    },
    async updateState(updater: (state: MainAreaState) => MainAreaState) {
      currentState = updater(currentState)
      return currentState
    },
  }

  const rename = handleWorkspaceRefreshWithContext(context, {
    renamed: [['/workspace/original.txt', '/workspace/renamed.txt']],
  })
  await editorUriChangeStarted.promise
  const reload = handleWorkspaceRefreshWithContext(context, {
    changed: ['/workspace/original.txt'],
  })
  await reloadStarted.promise
  releaseEditorUriChange.resolve()
  await rename
  releaseReload.resolve()
  await reload

  expect(currentState.layout.groups[0].tabs[0].uri).toBe('/workspace/renamed.txt')
})
