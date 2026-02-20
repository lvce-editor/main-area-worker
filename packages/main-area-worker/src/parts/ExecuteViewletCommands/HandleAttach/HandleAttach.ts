import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'

export const handleAttach = async (command: Extract<ViewletCommand, { type: 'attach' }>): Promise<void> => {
  // TODO find a better way to append editors
  const parentNodeSelector = '.editor-groups-container, .EditorGroup'

  await RendererWorker.invoke('Layout.attachViewlet', parentNodeSelector, command.instanceId)
}
