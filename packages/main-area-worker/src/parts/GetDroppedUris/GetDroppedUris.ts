import { RendererWorker } from '@lvce-editor/rpc-registry'
import { isChromiumDragId } from '../IsChromiumDragId/IsChromiumDragId.ts'
import { isDroppedFileSystemHandle } from '../IsDroppedFileSystemHandle/IsDroppedFileSystemHandle.ts'
import { isUriList } from '../IsUriList/IsUriList.ts'
import { parseUriList } from '../ParseUriList/ParseUriList.ts'

export interface DroppedItem {
  readonly kind: 'directory' | 'file' | 'unknown'
  readonly uri: string
}

interface DragInfoItem {
  readonly data: string
  readonly type: string
}

interface DragInfo {
  readonly items: readonly DragInfoItem[]
}

const addUris = (items: DroppedItem[], value: string): void => {
  for (const uri of parseUriList(value)) {
    items.push({ kind: 'unknown', uri })
  }
}

export const getDroppedItems = async (itemIds: readonly number[]): Promise<readonly DroppedItem[]> => {
  if (itemIds.length === 0) {
    return []
  }
  const items = (await RendererWorker.getFileHandles(itemIds)) as readonly unknown[]
  let hasChromiumDragId = false
  const droppedItems: DroppedItem[] = []
  for (const [index, item] of items.entries()) {
    if (isUriList(item)) {
      addUris(droppedItems, item.value)
      continue
    }
    if (isChromiumDragId(item)) {
      hasChromiumDragId = true
      continue
    }
    if (!isDroppedFileSystemHandle(item)) {
      continue
    }
    const handle = item.value
    const uri = `html:///dropped-files/${Date.now()}/${itemIds[index]}/${handle.name}`
    await RendererWorker.invoke('PersistentFileHandle.addHandle', uri, handle)
    droppedItems.push({ kind: handle.kind, uri })
  }
  if (droppedItems.length > 0 || !hasChromiumDragId) {
    return droppedItems
  }
  const dragInfo = await RendererWorker.invoke('Viewlet.getDragData')
  if (!dragInfo || typeof dragInfo !== 'object' || !Array.isArray((dragInfo as Partial<DragInfo>).items)) {
    return []
  }
  for (const item of (dragInfo as DragInfo).items) {
    const candidate = item as Partial<DragInfoItem>
    if (candidate.type === 'text/uri-list' && typeof candidate.data === 'string') {
      addUris(droppedItems, candidate.data)
    }
  }
  return droppedItems
}

export const getDroppedUris = async (itemIds: readonly number[]): Promise<readonly string[]> => {
  const items = await getDroppedItems(itemIds)
  return items.map((item) => item.uri)
}
