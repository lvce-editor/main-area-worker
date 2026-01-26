import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'

export const handleDetach = async (command: Extract<ViewletCommand, { type: 'detach' }>): Promise<void> => {
  // Hides viewlet but keeps it alive
  // @ts-ignore
  await RendererWorker.invoke('Viewlet.detach', command.instanceId)
}
