import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const RendererWorkerCallbackDelay = 50

const commandsWithDeferredRender = new Set(['handleContextMenu', 'handleTabContextMenu'])

export const handleMessagePort = async (
  port: MessagePort,
  viewletCommandMap: Readonly<Record<string, unknown>>,
  setAsRendererProcessFallback = true,
): Promise<void> => {
  const executeViewletCommand = async (uid: number, command: string, ...args: readonly any[]): Promise<void> => {
    const fn = viewletCommandMap[`MainArea.${command}`]
    if (typeof fn !== 'function') {
      throw new TypeError(`Viewlet command not found: ${command}`)
    }
    await fn(uid, ...args)
    if (commandsWithDeferredRender.has(command)) {
      setTimeout(() => {
        void RendererWorker.invoke('Viewlet.requestRender', uid)
      }, RendererWorkerCallbackDelay)
      return
    }
    await RendererWorker.invoke('Viewlet.requestRender', uid)
  }

  const rpc = await PlainMessagePortRpc.create({
    commandMap: {
      'Viewlet.executeViewletCommand': executeViewletCommand,
    },
    messagePort: port,
  })
  if (setAsRendererProcessFallback) {
    RendererProcess.set(rpc)
  }
}
