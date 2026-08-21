import { expect, jest, test } from '@jest/globals'
import { MenuEntryId } from '@lvce-editor/constants'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleContextMenu } from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

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

test('handleContextMenu should ignore a non-numeric group id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state = createDefaultState()

  const result = await handleContextMenu(state, 'invalid', 10, 20)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleContextMenu should wait for the renderer worker command for a direct connection', async () => {
  const { promise: showStarted, resolve: resolveShowStarted } = Promise.withResolvers<void>()
  const { promise: finishShow, resolve: resolveFinishShow } = Promise.withResolvers<void>()
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {
      resolveShowStarted()
      await finishShow
    },
  })
  RendererProcess.set(Object.assign(createMockRpc({ commandMap: {} }), { dispose: jest.fn() }))
  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 321,
  }

  const handling = handleContextMenu(state, '', 50, 60)

  await showStarted
  const pending = Symbol('pending')
  await expect(Promise.race([handling, Promise.resolve(pending)])).resolves.toBe(pending)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 321, MenuEntryId.Main, 50, 60, { groupId: -1, menuId: MenuEntryId.Main }]])
  resolveFinishShow()
  await expect(handling).resolves.toBe(state)
  await RendererProcessRegistry.dispose()
})
