import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import { createIconThemeWorkerRpc } from '../CreateIconThemeWorkerRpc/CreateIconThemeWorkerRpc.ts'
import { refreshFileIcons } from '../RefreshFileIcons/RefreshFileIcons.ts'

export const initializeIconThemeWorker = async (): Promise<void> => {
  const rpc = await createIconThemeWorkerRpc()
  IconThemeWorker.set(rpc)
  await refreshFileIcons()
}
