import { expect, test } from '@jest/globals'
import { MenuEntryId } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleContextMenu } from '../src/parts/HandleContextMenu/HandleContextMenu.ts'

test('handleContextMenu should show main menu with group id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 123,
  }

  const result = await handleContextMenu(state, '7', 100, 200)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 123, MenuEntryId.Main, 100, 200, { groupId: 7, menuId: MenuEntryId.Main }]])
})

test('handleContextMenu should ignore missing group id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 456,
  }

  const result = await handleContextMenu(state, undefined, 10, 20)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleContextMenu should show main menu for empty main area', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 789,
  }

  const result = await handleContextMenu(state, '', 30, 40)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 789, MenuEntryId.Main, 30, 40, { groupId: -1, menuId: MenuEntryId.Main }]])
})
