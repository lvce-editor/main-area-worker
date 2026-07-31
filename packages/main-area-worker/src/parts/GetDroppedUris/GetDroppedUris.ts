import { RendererWorker } from '@lvce-editor/rpc-registry'

interface DroppedStringItem {
  readonly kind: 'string'
  readonly type: string
  readonly value: string
}

interface DragInfoItem {
  readonly data: string
  readonly type: string
}

interface DragInfo {
  readonly items: readonly DragInfoItem[]
}

const lineSeparatorRegex = /\r?\n/
const chromiumDragIdRegex = /^[A-F\d]{32}$/i

const isUriList = (item: unknown): item is DroppedStringItem => {
  if (!item || typeof item !== 'object') {
    return false
  }
  const candidate = item as Partial<DroppedStringItem>
  return candidate.kind === 'string' && candidate.type === 'text/uri-list' && typeof candidate.value === 'string'
}

const parseUriList = (value: string): readonly string[] => {
  return value
    .split(lineSeparatorRegex)
    .map((uri) => uri.trim())
    .filter((uri) => uri && !uri.startsWith('#'))
}

const isChromiumDragId = (item: unknown): item is DroppedStringItem => {
  if (!item || typeof item !== 'object') {
    return false
  }
  const candidate = item as Partial<DroppedStringItem>
  return (
    candidate.kind === 'string' &&
    (candidate.type === '' || candidate.type === 'chromium/x-drag-id') &&
    typeof candidate.value === 'string' &&
    chromiumDragIdRegex.test(candidate.value)
  )
}

const isDragInfoItem = (item: unknown): item is DragInfoItem => {
  if (!item || typeof item !== 'object') {
    return false
  }
  const candidate = item as Partial<DragInfoItem>
  return candidate.type === 'text/uri-list' && typeof candidate.data === 'string'
}

const getUrisFromDragInfo = (dragInfo: unknown): readonly string[] => {
  if (!dragInfo || typeof dragInfo !== 'object' || !Array.isArray((dragInfo as Partial<DragInfo>).items)) {
    return []
  }
  return (dragInfo as DragInfo).items.filter(isDragInfoItem).flatMap((item) => parseUriList(item.data))
}

export const getDroppedUris = async (itemIds: readonly number[]): Promise<readonly string[]> => {
  if (itemIds.length === 0) {
    return []
  }
  const items = (await RendererWorker.getFileHandles(itemIds)) as readonly unknown[]
  const uris = items.filter(isUriList).flatMap((item) => parseUriList(item.value))
  if (uris.length > 0 || !items.some(isChromiumDragId)) {
    return uris
  }
  const dragInfo = await RendererWorker.invoke('Viewlet.getDragData')
  return getUrisFromDragInfo(dragInfo)
}
