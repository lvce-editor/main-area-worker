import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleHeaderDoubleClick } from '../src/parts/HandleHeaderDoubleClick/HandleHeaderDoubleClick.ts'

test('handleHeaderDoubleClick should return state unchanged when groupIndexRaw is empty', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleHeaderDoubleClick(state, 'NotMainTabs', '')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleHeaderDoubleClick should create a new untitled file when valid groupIndex is provided', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleHeaderDoubleClick(state, 'MainTabs', '0')

  expect(result).not.toBe(state)
  expect(result.layout.groups[0].tabs.length).toBeGreaterThan(1)
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0][0]).toBe('Layout.createViewlet')
})

test('handleHeaderDoubleClick should add untitled tab to the active group', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleHeaderDoubleClick(state, 'MainTabs', '0')

  const newTabs = result.layout.groups[0].tabs
  const untitledTab = newTabs.find((tab) => tab.title === 'Untitled')

  expect(untitledTab).toBeDefined()
  expect(untitledTab?.uri).toContain('untitled://')
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0][0]).toBe('Layout.createViewlet')
})
