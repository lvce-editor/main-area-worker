import { expect, test } from '@jest/globals'
import { MenuEntryId } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleTabContextMenu } from '../src/parts/HandleTabContextMenu/HandleTabContextMenu.ts'

test('handleTabContextMenu should show context menu with correct parameters', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 123,
  }

  const result = await handleTabContextMenu(state, 100, 200)

  expect(result).toBe(state)
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0]).toEqual(['ContextMenu.show2', 123, MenuEntryId.Tab, 100, 200, { menuId: MenuEntryId.Tab }])
})

test('handleTabContextMenu should return state unchanged', async () => {
  RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/assets',
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
    platform: 1,
    uid: 456,
  }

  const result = await handleTabContextMenu(state, 50, 75)

  expect(result).toBe(state)
  expect(result.assetDir).toBe('/test/assets')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(456)
  expect(result.layout.groups.length).toBe(1)
})

test('handleTabContextMenu should handle zero coordinates', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const result = await handleTabContextMenu(state, 0, 0)

  expect(result).toBe(state)
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0]).toEqual(['ContextMenu.show2', 1, MenuEntryId.Tab, 0, 0, { menuId: MenuEntryId.Tab }])
})

test('handleTabContextMenu should handle large coordinates', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 999,
  }

  const result = await handleTabContextMenu(state, 1920, 1080)

  expect(result).toBe(state)
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0]).toEqual(['ContextMenu.show2', 999, MenuEntryId.Tab, 1920, 1080, { menuId: MenuEntryId.Tab }])
})

test('handleTabContextMenu should use uid from state', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 42,
  }

  await handleTabContextMenu(state, 10, 20)

  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0][1]).toBe(42)
})
