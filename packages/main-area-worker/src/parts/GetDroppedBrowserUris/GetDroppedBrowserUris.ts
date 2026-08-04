import { RendererWorker } from '@lvce-editor/rpc-registry'
import { isChromiumDragId } from '../IsChromiumDragId/IsChromiumDragId.ts'
import { isDroppedFileSystemHandle } from '../IsDroppedFileSystemHandle/IsDroppedFileSystemHandle.ts'
import { isUriList } from '../IsUriList/IsUriList.ts'
import { parseUriList } from '../ParseUriList/ParseUriList.ts'

interface DragInfoItem {
  readonly data: string
  readonly type: string
}

interface DragInfo {
  readonly items: readonly DragInfoItem[]
}

const suffixByHandleKind = { directory: '/', file: '' } as const

export const getDroppedBrowserUris = async (itemIds: readonly number[]): Promise<readonly string[]> => {
  if (itemIds.length === 0) {
    return []
  }
  const items = (await RendererWorker.getFileHandles(itemIds)) as readonly unknown[]
  let hasChromiumDragId = false
  const uris: string[] = []
  for (const [index, item] of items.entries()) {
    if (isUriList(item)) {
      uris.push(...parseUriList(item.value))
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
    const suffix = suffixByHandleKind[handle.kind]
    const uri = `html:///dropped-files/${Date.now()}/${itemIds[index]}/${handle.name}${suffix}`
    await RendererWorker.invoke('PersistentFileHandle.addHandle', uri, handle)
    uris.push(uri)
  }
  if (uris.length > 0 || !hasChromiumDragId) {
    return uris
  }
  const dragInfo = await RendererWorker.invoke('Viewlet.getDragData')
  if (!dragInfo || typeof dragInfo !== 'object' || !Array.isArray((dragInfo as Partial<DragInfo>).items)) {
    return uris
  }
  for (const item of (dragInfo as DragInfo).items) {
    const candidate = item as Partial<DragInfoItem>
    if (candidate.type === 'text/uri-list' && typeof candidate.data === 'string') {
      uris.push(...parseUriList(candidate.data))
    }
  }
  return uris
}
