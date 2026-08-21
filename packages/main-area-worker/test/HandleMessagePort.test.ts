import { expect, jest, test } from '@jest/globals'
import { createMockRpc, PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererProcess, RendererWorker } from '@lvce-editor/rpc-registry'
import { handleMessagePort } from '../src/parts/HandleMessagePort/HandleMessagePort.ts'

test('accepts the legacy renderer process message port as a fallback', async () => {
  const { port1, port2 } = new MessageChannel()
  const rendererProcessRpc = await PlainMessagePortRpcParent.create({
    commandMap: {
      ping: async () => 'pong',
    },
    messagePort: port1,
  })

  await handleMessagePort(port2, {})

  await expect(RendererProcess.invoke('ping')).resolves.toBe('pong')
  await RendererProcess.dispose()
  await rendererProcessRpc.dispose()
})

test('connects a secondary direct view rpc', async () => {
  const { port1, port2 } = new MessageChannel()
  const rendererProcessRpc = await PlainMessagePortRpcParent.create({
    commandMap: {},
    messagePort: port1,
  })
  const handleEvent = jest.fn(async (_uid: number, _value: string) => {})
  const { promise: contextMenuStarted, resolve: resolveContextMenuStarted } = Promise.withResolvers<void>()
  const { promise: finishContextMenu, resolve: resolveFinishContextMenu } = Promise.withResolvers<void>()
  const handleContextMenu = jest.fn(async (_uid: number) => {
    resolveContextMenuStarted()
    await finishContextMenu
  })

  await handleMessagePort(
    port2,
    {
      'MainArea.handleContextMenu': handleContextMenu,
      'MainArea.handleEvent': handleEvent,
    },
    false,
  )

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

  const { promise: renderStarted, resolve: resolveRenderStarted } = Promise.withResolvers<void>()
  const { promise: finishRender, resolve: resolveFinishRender } = Promise.withResolvers<void>()
  requestRender.mockImplementationOnce(async () => {
    resolveRenderStarted()
    await finishRender
  })
  const handling = rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'handleContextMenu')
  const pending = Symbol('pending')
  await contextMenuStarted
  await expect(Promise.race([handling, Promise.resolve(pending)])).resolves.toBe(pending)
  expect(handleContextMenu).toHaveBeenCalledWith(7)
  expect(requestRender).toHaveBeenCalledTimes(1)
  resolveFinishContextMenu()
  await renderStarted
  await expect(Promise.race([handling, Promise.resolve(pending)])).resolves.toBe(pending)
  expect(requestRender).toHaveBeenCalledTimes(2)
  resolveFinishRender()
  await handling

  await expect(rendererProcessRpc.invoke('Viewlet.executeViewletCommand', 7, 'missing')).rejects.toThrow('Viewlet command not found: missing')

  await RendererWorker.dispose()
  await rendererProcessRpc.dispose()
})
