import { afterEach, expect, test } from '@jest/globals'
import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ClipBoardWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { initializeClipBoardWorker } from '../src/parts/InitializeClipBoardWorker/InitializeClipBoardWorker.ts'

afterEach(() => {
  ClipBoardWorker.dispose()
})

test('writes text through a lazily transferred message port', async () => {
  let writtenText = ''
  using rendererRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToClipBoardWorker': async (port: MessagePort) => {
      await PlainMessagePortRpc.create({
        commandMap: {
          'ClipBoard.writeText': async (text: string) => {
            writtenText = text
          },
        },
        messagePort: port,
      })
    },
  })

  await initializeClipBoardWorker()
  await ClipBoardWorker.writeText('/workspace/src/index.ts')

  expect(writtenText).toBe('/workspace/src/index.ts')
  expect(rendererRpc.invocations).toHaveLength(1)
  expect(rendererRpc.invocations[0][0]).toBe('SendMessagePortToExtensionHostWorker.sendMessagePortToClipBoardWorker')
})
