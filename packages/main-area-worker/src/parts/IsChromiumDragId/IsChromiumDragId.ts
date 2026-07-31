interface DroppedStringItem {
  readonly kind: 'string'
  readonly type: string
  readonly value: string
}

const chromiumDragIdRegex = /^[A-F\d]{32}$/i

export const isChromiumDragId = (item: unknown): item is DroppedStringItem => {
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
