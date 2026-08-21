import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleTabsWheel } from '../src/parts/HandleTabsWheel/HandleTabsWheel.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

const createState = (): MainAreaState => {
  const state = createDefaultState()
  return {
    ...state,
    layout: {
      activeGroupId: 4,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 4,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
    uid: 7,
    width: 800,
  }
}

test('handleTabsWheel scrolls horizontally by pixel delta', async () => {
  const scrollSelectorBy = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.scrollSelectorBy': scrollSelectorBy,
  })
  const state = createState()

  const result = await handleTabsWheel(state, '0', 0, 60)

  expect(result).toBe(state)
  expect(scrollSelectorBy).toHaveBeenCalledWith(7, '.MainTabs[data-group-index="0"]', 60)
})

test('handleTabsWheel converts line delta to pixels', async () => {
  const scrollSelectorBy = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.scrollSelectorBy': scrollSelectorBy,
  })
  const state = createState()

  await handleTabsWheel(state, '0', 1, 3)

  expect(scrollSelectorBy).toHaveBeenCalledWith(7, '.MainTabs[data-group-index="0"]', 48)
})

test('handleTabsWheel converts page delta to the available width', async () => {
  const scrollSelectorBy = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.scrollSelectorBy': scrollSelectorBy,
  })
  const state = createState()

  await handleTabsWheel(state, '0', 2, -1)

  expect(scrollSelectorBy).toHaveBeenCalledWith(7, '.MainTabs[data-group-index="0"]', -800)
})

test('handleTabsWheel ignores zero delta and invalid groups', async () => {
  const scrollSelectorBy = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.scrollSelectorBy': scrollSelectorBy,
  })
  const state = createState()

  expect(await handleTabsWheel(state, '0', 0, 0)).toBe(state)
  expect(await handleTabsWheel(state, '2', 0, 60)).toBe(state)
  expect(await handleTabsWheel(state, '', 0, 60)).toBe(state)
  expect(scrollSelectorBy).not.toHaveBeenCalled()
})

test('handleTabsWheel uses the direct renderer connection when available', async () => {
  const scrollSelectorBy = jest.fn()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.scrollSelectorBy': scrollSelectorBy } }))
  const state = createState()

  await handleTabsWheel(state, '0', 0, 60)

  expect(scrollSelectorBy).toHaveBeenCalledWith(7, '.MainTabs[data-group-index="0"]', 60)
})
