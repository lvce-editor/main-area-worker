import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { focus } from '../src/parts/Focus/Focus.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

const createState = (): MainAreaState => ({
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
            editorInput: {
              type: 'editor',
              uri: 'file:///test.txt',
            },
            editorUid: 42,
            icon: '',
            id: 2,
            isDirty: false,
            isPreview: false,
            title: 'test.txt',
          },
        ],
      },
    ],
  },
})

test('focus focuses via the renderer worker without a direct renderer connection', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector'() {},
  })
  const state = createState()

  await expect(focus(state)).resolves.toBe(state)
  expect(mockRpc.invocations).toEqual([['Viewlet.focusSelector', 42, '[name="editor"]']])
})

test('focus targets the search input without a direct renderer connection', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector'() {},
  })
  const state = createState()
  const group = state.layout.groups[0]
  const tab = group.tabs[0]
  const searchState: MainAreaState = {
    ...state,
    layout: {
      ...state.layout,
      groups: [
        {
          ...group,
          tabs: [{ ...tab, uri: 'search-editor://1/Search' }],
        },
      ],
    },
  }

  await expect(focus(searchState)).resolves.toBe(searchState)
  expect(mockRpc.invocations).toEqual([['Viewlet.focusSelector', 42, '[name="SearchValue"]']])
})

test('focus targets the search input after pending layout renders', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending'() {},
  })
  const viewletFocus = jest.fn()
  const focusAfterRender = jest.fn()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.focusSelector': viewletFocus, 'Viewlet.focusSelectorAfterRender': focusAfterRender } }))
  const state = createState()
  const group = state.layout.groups[0]
  const tab = group.tabs[0]
  const searchState: MainAreaState = {
    ...state,
    layout: {
      ...state.layout,
      groups: [
        {
          ...group,
          tabs: [{ ...tab, uri: 'search-editor://1/Search' }],
        },
      ],
    },
  }

  await expect(focus(searchState)).resolves.toBe(searchState)
  expect(mockRpc.invocations).toEqual([['Layout.renderMainAreaPending', state.uid]])
  expect(viewletFocus).toHaveBeenCalledWith(42, '[name="SearchValue"]')
  expect(focusAfterRender).toHaveBeenCalledWith(42, '[name="SearchValue"]')
})

test('focus commits the selected editor before focusing when a direct renderer is connected', async () => {
  using renderRpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending'() {},
  })
  const focusSelector = jest.fn<(id: number, selector: string) => void>(() => {
    expect(renderRpc.invocations).toEqual([['Layout.renderMainAreaPending', state.uid]])
  })
  const focusSelectorAfterRender = jest.fn()
  RendererProcess.set(
    createMockRpc({ commandMap: { 'Viewlet.focusSelector': focusSelector, 'Viewlet.focusSelectorAfterRender': focusSelectorAfterRender } }),
  )
  const state = createState()

  await expect(focus(state)).resolves.toBe(state)
  expect(focusSelector).toHaveBeenCalledWith(42, '[name="editor"]')
  expect(focusSelectorAfterRender).toHaveBeenCalledWith(42, '[name="editor"]')
})

test('focus does nothing when there is no active tab', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector'() {},
  })
  const state = createDefaultState()

  await expect(focus(state)).resolves.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('focus does nothing while the active editor is loading', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector'() {},
  })
  const state = createState()
  const loadingState: MainAreaState = {
    ...state,
    layout: {
      ...state.layout,
      groups: state.layout.groups.map((group) => ({
        ...group,
        tabs: group.tabs.map((tab) => ({ ...tab, editorUid: -1 })),
      })),
    },
  }

  await expect(focus(loadingState)).resolves.toBe(loadingState)
  expect(mockRpc.invocations).toEqual([])
})
