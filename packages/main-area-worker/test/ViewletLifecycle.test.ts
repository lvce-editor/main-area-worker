import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetNextRequestId from '../src/parts/GetNextRequestId/GetNextRequestId.ts'
import * as ViewletLifecycle from '../src/parts/ViewletLifecycle/ViewletLifecycle.ts'

const createStateWithTab = (tabOverrides: Partial<Tab> = {}): MainAreaState => ({
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
            editorUid: -1,
            errorMessage: '',
            icon: '',
            id: 1,
            isDirty: false,
            language: 'typescript',
            loadingState: 'idle',
            title: 'file.txt',
            uri: '/test/file.txt',
            ...tabOverrides,
            isPreview: tabOverrides.isPreview ?? false,
          },
        ],
      },
    ],
  },
  uid: 1,
})

test('createViewletForTab creates viewlet command for idle tab', () => {
  GetNextRequestId.resetRequestIdCounter()
  const state = createStateWithTab()
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 1, 'EditorText', bounds)

  expect(result).not.toBe(state)
  expect(result.layout.groups[0].tabs[0].editorUid).toBeDefined()
})

test('createViewletForTab creates a missing viewlet for a loading tab', () => {
  const state = createStateWithTab({ loadingState: 'loading' })
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 1, 'EditorText', bounds)

  expect(result).not.toBe(state)
  expect(result.layout.groups[0].tabs[0].editorUid).not.toBe(-1)
})

test('createViewletForTab creates a missing viewlet for a loaded restored tab', () => {
  const state = createStateWithTab({ loadingState: 'loaded' })
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 1, 'EditorText', bounds)

  expect(result).not.toBe(state)
  expect(result.layout.groups[0].tabs[0].editorUid).not.toBe(-1)
})

test('createViewletForTab returns empty commands for non-existent tab', () => {
  const state = createStateWithTab()
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 999, 'EditorText', bounds)

  expect(result).toBe(state)
})

test('switchViewlet with reference nodes - no attach/detach commands', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
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
              editorUid: 100,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorUid: 101,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = await ViewletLifecycle.switchViewlet(state, 1, 2)

  // Reference nodes handle attachment automatically - no commands needed
  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('switchViewlet with not-ready tab - still no attach/detach commands', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
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
              editorUid: 100,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorUid: 101,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = await ViewletLifecycle.switchViewlet(state, 1, 2)

  // Reference nodes handle it - only reference nodes for ready viewlets are rendered
  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('switchViewlet handles undefined fromTabId - no commands', async () => {
  const state = createStateWithTab()
  const result = await ViewletLifecycle.switchViewlet(state, undefined, 1)

  // Reference nodes handle attachment automatically
  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('handleViewletReady marks viewlet as ready without attach command', () => {
  GetNextRequestId.resetRequestIdCounter()
  const requestId = GetNextRequestId.getNextRequestId()

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
              editorUid: 100,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file.txt',
              uri: '/test/file.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.handleViewletReady(state, requestId)

  // Reference nodes handle attachment - no attach command needed
  expect(result).toBe(state)
})

test('handleViewletReady works regardless of active tab - reference nodes render correctly', () => {
  GetNextRequestId.resetRequestIdCounter()
  const requestId = GetNextRequestId.getNextRequestId()

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1, // Tab 2 is active, not tab 1
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorUid: 100,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorUid: 101,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.handleViewletReady(state, requestId)

  // Reference nodes render correctly regardless of active tab
  // Race condition is avoided: only active tab's reference node will be in virtual DOM
  expect(result).toBe(state)
})

test('handleViewletReady disposes viewlet when tab no longer exists', () => {
  const state = createStateWithTab()

  const result = ViewletLifecycle.handleViewletReady(state, 999)

  expect(result).toBe(state)
})

test('handleViewletReady uses a title rendered by the provider', () => {
  const state = createStateWithTab({ editorUid: 100, title: 'builtin.theme-atom-one-dark' })

  const result = ViewletLifecycle.handleViewletReady(state, 100, 'Atom One Dark Theme')

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    loadingState: 'loaded',
    title: 'Atom One Dark Theme',
  })
})

test('handleViewletReady preserves the fallback title when the provider has no title', () => {
  const state = createStateWithTab({ editorUid: 100, title: 'test.ts' })

  const result = ViewletLifecycle.handleViewletReady(state, 100)

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    loadingState: 'loaded',
    title: 'test.ts',
  })
})

test('disposeViewletForTab creates dispose command for tab with viewlet', () => {
  const state = createStateWithTab({ editorUid: 100 })
  const result = ViewletLifecycle.disposeViewletForTab(state, 1)

  expect(result.commands).toHaveLength(1)
  expect(result.commands[0].type).toBe('dispose')
})

test('disposeViewletForTab returns empty commands for tab without viewlet', () => {
  const state = createStateWithTab()

  const result = ViewletLifecycle.disposeViewletForTab(state, 1)

  expect(result.commands).toHaveLength(0)
})

test('disposeViewletForTab returns empty commands for non-existent tab', () => {
  const state = createStateWithTab()

  const result = ViewletLifecycle.disposeViewletForTab(state, 999)

  expect(result.commands).toHaveLength(0)
})

test('switchViewlet requests blur before detaching the outgoing editor', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand'() {},
  })
  const state = createStateWithTab({ editorInput: { type: 'editor', uri: '/test/file.txt' }, editorUid: 42, id: 1, loadingState: 'loaded' })

  const result = await ViewletLifecycle.switchViewlet(state, 1, 2)

  expect(mockRpc.invocations).toEqual([['Viewlet.executeViewletCommand', 42, 'handleBlur']])
  expect(result.newState).toBe(state)
  expect(result.commands).toEqual([])
})

test('switchViewlet does not blur the editor when the active tab is unchanged', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state = createStateWithTab({ editorInput: { type: 'editor', uri: '/test/file.txt' }, editorUid: 42, id: 1, loadingState: 'loaded' })

  await ViewletLifecycle.switchViewlet(state, 1, 1)

  expect(mockRpc.invocations).toEqual([])
})

test('switchViewlet does not blur an editor that is still being created', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state = createStateWithTab({ editorInput: { type: 'editor', uri: '/test/file.txt' }, editorUid: 42, id: 1, loadingState: 'loading' })

  await ViewletLifecycle.switchViewlet(state, 1, 2)

  expect(mockRpc.invocations).toEqual([])
})

test('switchViewlet completes while blur waits for the navigating editor command', async () => {
  const blur = Promise.withResolvers<void>()
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand'() {
      return blur.promise
    },
  })
  const state = createStateWithTab({ editorInput: { type: 'editor', uri: '/test/file.txt' }, editorUid: 42, id: 1, loadingState: 'loaded' })
  const switching = ViewletLifecycle.switchViewlet(state, 1, 2, false)

  try {
    // The outgoing editor cannot process blur until its navigation command returns.
    const navigation = async () => {
      await switching
      return true
    }
    const nextTurn = async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 0))
      return false
    }
    const completed = await Promise.race([navigation(), nextTurn()])
    expect(completed).toBe(true)
    expect(mockRpc.invocations).toEqual([['Viewlet.executeViewletCommand', 42, 'handleBlur']])
  } finally {
    blur.resolve()
    await switching
  }
})

test('switchViewlet reports a rejected blur without failing navigation', async () => {
  using warning = jest.spyOn(console, 'warn').mockImplementation(() => {})
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand'() {
      throw new Error('editor disposed')
    },
  })
  const state = createStateWithTab({ editorInput: { type: 'editor', uri: '/test/file.txt' }, editorUid: 42, id: 1, loadingState: 'loaded' })

  const result = await ViewletLifecycle.switchViewlet(state, 1, 2, false)
  await new Promise<void>((resolve) => setTimeout(resolve, 0))

  expect(result.newState).toBe(state)
  expect(mockRpc.invocations).toHaveLength(1)
  expect(warning).toHaveBeenCalledWith('Failed to blur outgoing editor: Error: editor disposed')
})

test('switchViewlet waits for blur during ordinary tab selection', async () => {
  const blur = Promise.withResolvers<void>()
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand'() {
      return blur.promise
    },
  })
  const state = createStateWithTab({ editorInput: { type: 'editor', uri: '/test/file.txt' }, editorUid: 42, id: 1, loadingState: 'loaded' })
  let completed = false
  const select = async () => {
    await ViewletLifecycle.switchViewlet(state, 1, 2)
    completed = true
  }
  const selecting = select()

  try {
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
    expect(completed).toBe(false)
    expect(mockRpc.invocations).toEqual([['Viewlet.executeViewletCommand', 42, 'handleBlur']])
  } finally {
    blur.resolve()
    await selecting
  }
  expect(completed).toBe(true)
})
