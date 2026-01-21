import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostManagement from '../src/parts/ExtensionHostManagement/ExtensionHostManagement.ts'

test('activateByEvent should call RendererWorker.activateByEvent with correct event', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('test.event', '', 0)

  expect(mockRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'test.event', '', 0]])
})

test('activateByEvent should handle different event names', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('onLanguage', '', 0)

  expect(mockRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'onLanguage', '', 0]])
})

test('activateByEvent should be awaitable', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('test.event', '', 0)

  expect(mockRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'test.event', '', 0]])
})
