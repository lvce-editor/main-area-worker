import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

const classVertical = 'Sash SashVertical'

const classHorizontal = 'Sash SashHorizontal'

export const getSashClassName = (direction: 1 | 2): string => {
  return direction === LayoutDirection.Horizontal ? classVertical : classHorizontal
}
