import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

export const getSashClassName = (direction: 1 | 2): string => {
  return direction === LayoutDirection.Horizontal ? 'Sash SashVertical' : 'Sash SashHorizontal'
}
