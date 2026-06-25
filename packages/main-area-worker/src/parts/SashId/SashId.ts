export const create = (beforeGroupId: number, afterGroupId: number): string => {
  return `${beforeGroupId}:${afterGroupId}`
}

export const parse = (sashId: string): { beforeGroupId: number; afterGroupId: number } | undefined => {
  if (!sashId) {
    return undefined
  }
  const [beforeRaw, afterRaw] = sashId.split(':')
  if (!beforeRaw || !afterRaw) {
    return undefined
  }
  const beforeGroupId = Number(beforeRaw)
  const afterGroupId = Number(afterRaw)
  if (!Number.isFinite(beforeGroupId) || !Number.isFinite(afterGroupId)) {
    return undefined
  }
  return {
    afterGroupId,
    beforeGroupId,
  }
}
