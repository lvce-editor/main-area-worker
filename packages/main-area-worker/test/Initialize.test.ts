import { expect, test, afterEach } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as Initialize from '../src/parts/Initialize/Initialize.ts'

afterEach(() => {
  ExtensionHost.registerMockRpc({})
})

test('initialize should create extension host rpc and set it', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
  })
  ;(mockRendererRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }

  await Initialize.initialize()

  expect(mockRendererRpc.invocations).toEqual([])
})
