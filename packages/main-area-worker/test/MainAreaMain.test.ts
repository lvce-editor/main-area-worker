import { expect, test } from '@jest/globals'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry, RendererWorker } from '@lvce-editor/rpc-registry'
import * as MainAreaMain from '../src/parts/MainAreaMain/MainAreaMain.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('connects the renderer process over the native web worker rpc', async () => {
  const { dispose } = mockWorkerGlobalRpc()

  await MainAreaMain.main()

  expect(RendererProcess.isConnected()).toBe(true)
  await RendererProcessRegistry.dispose()
  dispose()
})

test('connects the renderer worker over the transferred message port rpc', async () => {
  const { port1, port2 } = new MessageChannel()

  await expect(MainAreaMain.initialize('message-port', port2)).resolves.toBeUndefined()

  await RendererWorker.dispose()
  port1.close()
  port2.close()
})
