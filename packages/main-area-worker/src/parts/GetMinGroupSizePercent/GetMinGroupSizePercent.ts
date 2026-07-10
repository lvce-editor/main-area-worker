export const getMinGroupSizePercent = (axisSize: number, minGroupSizePx: number): number => {
  if (!axisSize) {
    return 0
  }
  return (minGroupSizePx / axisSize) * 100
}
