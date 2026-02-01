export const measureTabWidth = (label: string, fontWeight: number, fontSize: number, fontFamily: string, letterSpacing: string): number => {
  const width = label.length * 8
  const padding = 5
  const fileIconWidth = 16
  const fileIconGap = 4
  const closeButtonWidth = 23
  const closeButtonGap = 4
  const tabWidth = width + padding * 2 + fileIconWidth + fileIconGap + closeButtonWidth + closeButtonGap
  const tabWidthInt = Math.ceil(tabWidth)
  return tabWidthInt
}
