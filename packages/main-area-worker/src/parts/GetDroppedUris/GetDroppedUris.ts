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

interface DroppedFileHandle {
  readonly kind: 'file'
  readonly name: string
}

interface DroppedFileItem {
  readonly kind: 'file'
  readonly type: string
  readonly value: DroppedFileHandle
}

const lineSeparatorRegex = /\r?\n/
const chromiumDragIdRegex = /^[A-F\d]{32}$/i
const getDroppedFileTimestamp = (() => {
  let lastTimestamp = 0
  return (): number => {
    lastTimestamp = Math.max(Date.now(), lastTimestamp + 1)
    return lastTimestamp
  }
})()

const getDroppedFileUri = (name: string): string => {
  return `html:///dropped-files/${getDroppedFileTimestamp()}/${name}`
}

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

const isDroppedFile = (item: unknown): item is DroppedFileItem => {
  if (!item || typeof item !== 'object') {
    return false
  }
  const candidate = item as Partial<DroppedFileItem>
  const handle = candidate.value
  return candidate.kind === 'file' && Boolean(handle) && typeof handle === 'object' && handle.kind === 'file' && typeof handle.name === 'string'
}

export const getDroppedUris = async (itemIds: readonly number[]): Promise<readonly string[]> => {
  if (itemIds.length === 0) {
    return []
  }
  const items = (await RendererWorker.getFileHandles(itemIds)) as readonly unknown[]
  let hasChromiumDragId = false
  const uris: string[] = []
  for (const item of items) {
    if (isUriList(item)) {
      uris.push(...parseUriList(item.value))
      continue
    }
    if (isChromiumDragId(item)) {
      hasChromiumDragId = true
      continue
    }
    if (!isDroppedFile(item)) {
      continue
    }
    const handle = item.value
    const uri = getDroppedFileUri(handle.name)
    await RendererWorker.invoke('PersistentFileHandle.addHandle', uri, handle)
    uris.push(uri)
  }
  if (uris.length > 0 || !hasChromiumDragId) {
    return uris
  }
  const dragInfo = await RendererWorker.invoke('Viewlet.getDragData')
  if (!dragInfo || typeof dragInfo !== 'object' || !Array.isArray((dragInfo as Partial<DragInfo>).items)) {
    return []
  }
  for (const item of (dragInfo as DragInfo).items) {
    const candidate = item as Partial<DragInfoItem>
    if (candidate.type === 'text/uri-list' && typeof candidate.data === 'string') {
      uris.push(...parseUriList(candidate.data))
    }
  }
  return uris
}
