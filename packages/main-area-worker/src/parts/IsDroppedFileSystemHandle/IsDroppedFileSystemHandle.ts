interface DroppedFileSystemHandle {
  readonly kind: 'directory' | 'file'
  readonly name: string
}

interface DroppedFileSystemHandleItem {
  readonly kind: 'file'
  readonly type: string
  readonly value: DroppedFileSystemHandle
}

export const isDroppedFileSystemHandle = (item: unknown): item is DroppedFileSystemHandleItem => {
  if (!item || typeof item !== 'object') {
    return false
  }
  const candidate = item as Partial<DroppedFileSystemHandleItem>
  const handle = candidate.value
  return (
    candidate.kind === 'file' &&
    Boolean(handle) &&
    typeof handle === 'object' &&
    (handle.kind === 'directory' || handle.kind === 'file') &&
    typeof handle.name === 'string'
  )
}
