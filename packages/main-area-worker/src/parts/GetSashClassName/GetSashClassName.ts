export const getSashClassName = (direction: 'horizontal' | 'vertical'): string => {
  return direction === 'horizontal' ? 'Sash SashVertical' : 'Sash SashHorizontal'
}
