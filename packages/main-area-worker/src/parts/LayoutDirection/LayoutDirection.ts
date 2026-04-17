export const Horizontal = 1
export const Vertical = 2

export type LayoutDirection = 1 | 2

export const isLayoutDirection = (direction: unknown): direction is LayoutDirection => {
  return direction === Horizontal || direction === Vertical
}

export const normalizeLayoutDirection = (direction: unknown): LayoutDirection | undefined => {
  if (isLayoutDirection(direction)) {
    return direction
  }
  if (direction === 'horizontal') {
    return Horizontal
  }
  if (direction === 'vertical') {
    return Vertical
  }
  return undefined
}