import { expect, jest, test } from '@jest/globals'
import { PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererProcess } from '@lvce-editor/rpc-registry'
import { handleMessagePort } from '../src/parts/HandleMessagePort/HandleMessagePort.ts'

test('handleMessagePort connects the main area worker to the renderer process', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 31)
  const { port1, port2 } = new MessageChannel()
  const rendererProcessRpc = await PlainMessagePortRpcParent.create({
    commandMap: {
      'Viewlet.queueCommands': queueCommands,
    },
    messagePort: port1,
  })

  await handleMessagePort(port2)
  await expect(RendererProcess.invoke('Viewlet.queueCommands', 7, [['Viewlet.setDom2', 7, []]])).resolves.toBe(31)
  expect(queueCommands).toHaveBeenCalledWith(7, [['Viewlet.setDom2', 7, []]])

  await RendererProcess.dispose()
  await rendererProcessRpc.dispose()
})
