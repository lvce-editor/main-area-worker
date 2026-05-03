export const hasTargetGroup = (groupId: number | undefined): groupId is number => {
  return groupId !== undefined && groupId >= 0
}
