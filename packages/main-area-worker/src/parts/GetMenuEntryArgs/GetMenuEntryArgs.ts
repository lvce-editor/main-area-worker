import * as HasTargetGroup from '../HasTargetGroup/HasTargetGroup.ts'

export const getMenuEntryArgs = (groupId: number | undefined): readonly number[] | undefined => {
  if (!HasTargetGroup.hasTargetGroup(groupId)) {
    return undefined
  }
  return [groupId]
}
