import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { newWindow } from '../src/parts/NewWindow/NewWindow.ts'

test('newWindow should ask renderer worker to open a new window', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.newWindow': async () => {},
  })

  const state: MainAreaState = createDefaultState()

  const result = await newWindow(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Main.newWindow']])
})
