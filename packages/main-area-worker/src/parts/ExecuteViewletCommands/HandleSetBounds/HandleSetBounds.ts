import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'

export const handleSetBounds = async (command: Extract<ViewletCommand, { type: 'setBounds' }>): Promise<void> => {
  // @ts-ignore
  await RendererWorker.invoke('Viewlet.setBounds', command.instanceId, command.bounds)
}
