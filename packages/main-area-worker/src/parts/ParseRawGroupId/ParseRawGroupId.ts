export const parseRawGroupId = (rawGroupId: string | undefined): number | undefined => {
  if (!rawGroupId) {
    return undefined
  }
  const groupId = Number.parseFloat(rawGroupId)
  return Number.isNaN(groupId) ? undefined : groupId
}
