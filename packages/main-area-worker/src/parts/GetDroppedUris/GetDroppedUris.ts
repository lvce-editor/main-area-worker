import { RendererWorker } from '@lvce-editor/rpc-registry'

interface DroppedStringItem {
  readonly kind: 'string'
  readonly type: string
  readonly value: string
}

const lineSeparatorRegex = /\r?\n/

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

export const getDroppedUris = async (itemIds: readonly number[]): Promise<readonly string[]> => {
  if (itemIds.length === 0) {
    return []
  }
  const items = (await RendererWorker.getFileHandles(itemIds)) as readonly unknown[]
  return items.filter(isUriList).flatMap((item) => parseUriList(item.value))
}
