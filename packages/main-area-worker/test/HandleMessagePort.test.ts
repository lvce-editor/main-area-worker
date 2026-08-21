import { expect, jest, test } from '@jest/globals'
import { createMockRpc, PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { handleMessagePort } from '../src/parts/HandleMessagePort/HandleMessagePort.ts'

test('connects a secondary direct view rpc', async () => {
  const { port1, port2 } = new MessageChannel()
  const rendererProcessRpc = await PlainMessagePortRpcParent.create({
    commandMap: {},
    messagePort: port1,
  })
  const handleEvent = jest.fn(async (_uid: number, _value: string) => {})
  const handleContextMenu = jest.fn(async (_uid: number) => {})

  await handleMessagePort(port2, {
    'MainArea.handleContextMenu': handleContextMenu,
    'MainArea.handleEvent': handleEvent,
  })

  const requestRender = jest.fn(async (_uid: number) => {})
  RendererWorker.set(
    Object.assign(
      createMockRpc({
        commandMap: {
          'Viewlet.requestRender': requestRender,
        },
      }),
      { dispose: jest.fn() },
    ),
  )
  await rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleEvent', 'hello')
  expect(handleEvent).toHaveBeenCalledWith(7, 'hello')
  expect(requestRender).toHaveBeenCalledWith(7)

  const { promise: rendered, resolve } = Promise.withResolvers<void>()
  requestRender.mockImplementationOnce(async () => {
    resolve()
  })
  await rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleContextMenu')
  expect(handleContextMenu).toHaveBeenCalledWith(7)
  expect(requestRender).toHaveBeenCalledTimes(1)
  await rendered
  expect(requestRender).toHaveBeenCalledTimes(2)

  await expect(rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'missing')).rejects.toThrow('Viewlet command not found: missing')

  await RendererWorker.dispose()
  await rendererProcessRpc.dispose()
})
