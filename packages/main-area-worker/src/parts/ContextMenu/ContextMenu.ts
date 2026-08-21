import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ContextMenuProps } from '../ContextMenuProps/ContextMenuProps.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const show2 = async <T extends ContextMenuProps>(
  uid: number,
  menuId: ContextMenuProps['menuId'],
  x: number,
  y: number,
  args: ContextMenuProps,
): Promise<void> => {
  if (RendererProcess.isConnected()) {
    await RendererProcess.invoke('Viewlet.forwardRendererWorkerCommand', 'ContextMenu.show2', uid, menuId, x, y, args)
    return
  }
  await RendererWorker.showContextMenu2(uid, menuId, x, y, args)
}
