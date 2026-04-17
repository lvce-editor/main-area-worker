export const getMinGroupSizePercent = (axisSize: number, minGroupWidthPx: number): number => {
  if (!axisSize) {
    return 10
  }
  const minPercent = (minGroupWidthPx / axisSize) * 100
  // Ensure minimum is at least 10%, matching the CSS 250px constraint on typical widths
  return Math.max(minPercent, 10)
}
