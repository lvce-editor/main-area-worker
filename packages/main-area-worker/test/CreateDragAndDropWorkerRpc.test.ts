import { expect, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess } from '@lvce-editor/rpc-registry'
import { send } from '../src/parts/CreateDragAndDropWorkerRpc/CreateDragAndDropWorkerRpc.ts'

test('transfers the direct rpc port through the renderer process', async () => {
  const rendererProcessRpc = createMockRpc({
    commandMap: {
      'DragAndDrop.handleMessagePort'() {},
    },
  })
  RendererProcess.set(rendererProcessRpc)
  const port = {} as MessagePort

  await send(port)

  expect(rendererProcessRpc.invocations).toEqual([['DragAndDrop.handleMessagePort', port]])
})
