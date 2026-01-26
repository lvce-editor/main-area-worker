import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'

export const handleAttach = async (command: Extract<ViewletCommand, { type: 'attach' }>): Promise<void> => {
  // Makes viewlet visible - only call after race condition check
  // @ts-ignore
  await RendererWorker.invoke('Viewlet.attach', command.instanceId)
}
