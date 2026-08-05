import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import { createDragAndDropWorkerRpc } from '../CreateDragAndDropWorkerRpc/CreateDragAndDropWorkerRpc.ts'

export const initializeDragAndDropWorker = async (): Promise<void> => {
  DragAndDropWorker.set(await createDragAndDropWorkerRpc())
}
