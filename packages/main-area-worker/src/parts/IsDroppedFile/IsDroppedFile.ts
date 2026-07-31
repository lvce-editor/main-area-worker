interface DroppedFileHandle {
  readonly kind: 'file'
  readonly name: string
}

interface DroppedFileItem {
  readonly kind: 'file'
  readonly type: string
  readonly value: DroppedFileHandle
}

export const isDroppedFile = (item: unknown): item is DroppedFileItem => {
  if (!item || typeof item !== 'object') {
    return false
  }
  const candidate = item as Partial<DroppedFileItem>
  const handle = candidate.value
  return candidate.kind === 'file' && Boolean(handle) && typeof handle === 'object' && handle.kind === 'file' && typeof handle.name === 'string'
}
