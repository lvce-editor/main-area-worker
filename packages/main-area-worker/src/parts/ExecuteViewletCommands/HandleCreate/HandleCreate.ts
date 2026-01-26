import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'

export const handleCreate = async (command: Extract<ViewletCommand, { type: 'create' }>, uid?: number): Promise<void> => {
  // Safe to call - no visible side effects
  // @ts-ignore
  const instanceId = Math.random() // TODO try to find a better way to get consistent integer ids (thread safe)

  await RendererWorker.invoke(
    'Layout.createViewlet',
    command.viewletModuleId,
    command.requestId,
    command.tabId,
    command.bounds,
    command.uri,
    instanceId,
  )
}
