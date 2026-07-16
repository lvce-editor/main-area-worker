import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getViewProviderEntries, reopenEditorWith } from '../src/parts/ReopenEditorWith/ReopenEditorWith.ts'

const createState = (): MainAreaState => ({
  ...createDefaultState(),
  height: 600,
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 7,
        focused: true,
        id: 1,
        isEmpty: false,
        size: 100,
        tabs: [
          {
            editorInput: {
              type: 'image',
              uri: 'file:///workspace/image.png',
            },
            editorType: 'custom',
            editorUid: 42,
            icon: 'image-icon',
            id: 7,
            isDirty: false,
            isPreview: false,
            loadingState: 'loaded',
            title: 'image.png',
            uri: 'file:///workspace/image.png',
          },
        ],
      },
    ],
  },
  width: 800,
})

const createContext = (initialState: MainAreaState): { context: AsyncCommandContext<MainAreaState>; getState: () => MainAreaState } => {
  let state = initialState
  return {
    context: {
      getState: () => state,
      updateState: (updater) => {
        state = updater(state)
        return Promise.resolve(state)
      },
    },
    getState: () => state,
  }
}

test('getViewProviderEntries returns text editor and matching registered providers', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'WebView.getWebViews': async () => [
      {
        id: 'builtin.csv-viewer',
        name: 'CSV Viewer',
        selector: ['.csv'],
      },
      {
        id: 'builtin.markdown-preview',
        name: 'Markdown Preview',
        selector: ['.md'],
      },
    ],
  })

  await expect(getViewProviderEntries('file:///workspace/data.csv')).resolves.toEqual([
    {
      id: 'editor',
      label: 'Text Editor',
      type: 'editor',
    },
    {
      id: 'builtin.csv-viewer',
      label: 'CSV Viewer',
      type: 'webview',
    },
  ])
})

test('getViewProviderEntries falls back to text editor when provider lookup fails', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'WebView.getWebViews': async () => {
      throw new Error('provider lookup failed')
    },
  })

  await expect(getViewProviderEntries('file:///workspace/image.png')).resolves.toEqual([
    {
      id: 'editor',
      label: 'Text Editor',
      type: 'editor',
    },
  ])
})

test('reopenEditorWith reopens an image preview as a text editor in the same tab', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostQuickPick.showQuickPick': async ({ items }: any) => items[0].value,
    'Layout.createViewlet': async () => {},
    'Viewlet.dispose': async () => {},
    'Viewlet.getTitle': async () => undefined,
    'WebView.getWebViews': async () => [],
  })
  const { context, getState } = createContext(createState())

  await reopenEditorWith(context)

  const tab = getState().layout.groups[0].tabs[0]
  expect(tab).toMatchObject({
    editorInput: {
      forceText: true,
      type: 'editor',
      uri: 'file:///workspace/image.png',
    },
    editorType: 'text',
    icon: 'image-icon',
    id: 7,
    isPreview: false,
    loadingState: 'loaded',
    title: 'image.png',
    uri: 'file:///workspace/image.png',
  })
  expect(tab.editorUid).not.toBe(42)
  expect(mockRpc.invocations).toEqual([
    ['WebView.getWebViews'],
    [
      'ExtensionHostQuickPick.showQuickPick',
      {
        items: [
          {
            description: '',
            label: 'Text Editor',
            value: {
              id: 'editor',
              label: 'Text Editor',
              type: 'editor',
            },
          },
        ],
        placeholder: 'Select Editor',
      },
    ],
    ['Layout.createViewlet', 'Editor', tab.editorUid, 7, { height: 565, width: 800, x: 0, y: 35 }, 'file:///workspace/image.png'],
    ['Viewlet.getTitle', tab.editorUid],
    ['Viewlet.dispose', 42],
  ])
})

test('reopenEditorWith opens a selected registered provider', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostQuickPick.showQuickPick': async ({ items }: any) => items[1].value,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'WebView',
    'Viewlet.dispose': async () => {},
    'Viewlet.getTitle': async () => undefined,
    'WebView.getWebViews': async () => [
      {
        id: 'builtin.image-viewer',
        name: 'Image Viewer',
        selector: ['.png'],
      },
    ],
  })
  const { context, getState } = createContext(createState())

  await reopenEditorWith(context)

  const tab = getState().layout.groups[0].tabs[0]
  expect(tab.editorInput).toEqual({
    providerId: 'builtin.image-viewer',
    type: 'webview',
    uri: 'file:///workspace/image.png',
  })
  expect(tab.editorType).toBe('custom')
  expect(mockRpc.invocations).toContainEqual(['Layout.getModuleId', 'file:///workspace/image.png', 'builtin.image-viewer'])
  expect(mockRpc.invocations).toContainEqual([
    'Layout.createViewlet',
    'WebView',
    tab.editorUid,
    7,
    { height: 565, width: 800, x: 0, y: 35 },
    'file:///workspace/image.png',
  ])
})

test('reopenEditorWith keeps the current editor when the quick pick is cancelled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostQuickPick.showQuickPick': async () => undefined,
    'WebView.getWebViews': async () => [],
  })
  const initialState = createState()
  const { context, getState } = createContext(initialState)

  await reopenEditorWith(context)

  expect(getState()).toBe(initialState)
  expect(mockRpc.invocations).toEqual([
    ['WebView.getWebViews'],
    [
      'ExtensionHostQuickPick.showQuickPick',
      expect.objectContaining({
        placeholder: 'Select Editor',
      }),
    ],
  ])
})

test('reopenEditorWith does nothing when there is no active tab', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const initialState = createDefaultState()
  const { context, getState } = createContext(initialState)

  await reopenEditorWith(context)

  expect(getState()).toBe(initialState)
  expect(mockRpc.invocations).toEqual([])
})
