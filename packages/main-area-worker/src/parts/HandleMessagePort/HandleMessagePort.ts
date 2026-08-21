import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const deferredRendererWorkerCommands = new Set(['handleContextMenu', 'handleTabContextMenu'])

export const handleMessagePort = async (
  port: MessagePort,
  viewletCommandMap: Readonly<Record<string, unknown>>,
  setAsRendererProcess = true,
): Promise<void> => {
  const executeViewletCommand = async (uid: number, command: string, ...args: readonly any[]): Promise<void> => {
    const fn = viewletCommandMap[`MainArea.${command}`]
    if (typeof fn !== 'function') {
      throw new TypeError(`Viewlet command not found: ${command}`)
    }
    if (deferredRendererWorkerCommands.has(command)) {
      // Context-menu handlers call back into the renderer worker. Let the
      // originating renderer-worker -> renderer-process pointer action finish first.
      setTimeout(() => {
        void (async (): Promise<void> => {
          await fn(uid, ...args)
          await RendererWorker.invoke('Viewlet.requestRender', uid)
        })()
      }, 0)
      return
    }
    await fn(uid, ...args)
    await RendererWorker.invoke('Viewlet.requestRender', uid)
  }

  const rpc = await PlainMessagePortRpc.create({
    commandMap: {
      'Viewlet.executeViewletCommand': executeViewletCommand,
    },
    messagePort: port,
  })
  if (setAsRendererProcess) {
    RendererProcess.set(rpc)
  }
}
