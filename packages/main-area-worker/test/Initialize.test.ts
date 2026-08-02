import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Initialize from '../src/parts/Initialize/Initialize.ts'

test('initialize should not transfer a message port', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({})

  await Initialize.initialize()

  expect(mockRendererRpc.invocations).toEqual([])
})
