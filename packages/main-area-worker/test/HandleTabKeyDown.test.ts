import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleTabKeyDown } from '../src/parts/HandleTabKeyDown/HandleTabKeyDown.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

const createState = (): MainAreaState => ({
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
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'File 1',
          },
          {
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: false,
            isPreview: false,
            title: 'File 2',
          },
          {
            editorUid: -1,
            icon: '',
            id: 3,
            isDirty: false,
            isPreview: false,
            title: 'File 3',
          },
        ],
      },
    ],
  },
  uid: 42,
})

test.each([
  ['ArrowRight', 2],
  ['ArrowLeft', 0],
  ['Home', 0],
  ['End', 2],
])('handleTabKeyDown should move focus for %s', async (key, expectedIndex) => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector'() {},
  })
  const state = createState()

  const result = await handleTabKeyDown(state, '0', '1', key)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Viewlet.focusSelector', 42, `.MainTab[data-group-index="0"][data-index="${expectedIndex}"]`]])
})

test('handleTabKeyDown should wrap arrow focus within the tab list', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector'() {},
  })
  const state = createState()

  await handleTabKeyDown(state, '0', '0', 'ArrowLeft')
  await handleTabKeyDown(state, '0', '2', 'ArrowRight')

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.focusSelector', 42, '.MainTab[data-group-index="0"][data-index="2"]'],
    ['Viewlet.focusSelector', 42, '.MainTab[data-group-index="0"][data-index="0"]'],
  ])
})

test.each(['Enter', ' ', 'Space'])('handleTabKeyDown should activate the focused tab for %j', async (key) => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector'() {},
  })
  const state = createState()

  const result = await handleTabKeyDown(state, '0', '1', key)

  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(mockRpc.invocations).toEqual([])
})

test.each([
  ['', '1', 'ArrowRight'],
  ['0', '', 'ArrowRight'],
  ['1', '0', 'ArrowRight'],
  ['0', '3', 'ArrowRight'],
  ['0', '1', 'Tab'],
])('handleTabKeyDown should ignore invalid or unrelated input', async (groupIndex, tabIndex, key) => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.focusSelector'() {},
  })
  const state = createState()

  const result = await handleTabKeyDown(state, groupIndex, tabIndex, key)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleTabKeyDown should focus through a direct renderer connection when available', async () => {
  const focusSelector = jest.fn()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.focusSelector': focusSelector } }))
  const state = createState()

  const result = await handleTabKeyDown(state, '0', '0', 'ArrowRight')

  expect(result).toBe(state)
  expect(focusSelector).toHaveBeenCalledWith(42, '.MainTab[data-group-index="0"][data-index="1"]')
})
