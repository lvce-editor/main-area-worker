import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'

export const handleDispose = async (command: Extract<ViewletCommand, { type: 'dispose' }>): Promise<void> => {
  // Fully destroys viewlet

  await RendererWorker.invoke('Viewlet.dispose', command.instanceId)
}
