interface DroppedStringItem {
  readonly kind: 'string'
  readonly type: string
  readonly value: string
}

export const isUriList = (item: unknown): item is DroppedStringItem => {
  if (!item || typeof item !== 'object') {
    return false
  }
  const candidate = item as Partial<DroppedStringItem>
  return candidate.kind === 'string' && candidate.type === 'text/uri-list' && typeof candidate.value === 'string'
}
