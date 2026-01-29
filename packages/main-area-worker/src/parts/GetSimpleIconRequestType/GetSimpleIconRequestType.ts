import * as DirentType from '../DirentType/DirentType.ts'

export const getSimpleIconRequestType = (direntType: number): 1 | 2 => {
  if (direntType === DirentType.Directory || direntType === DirentType.DirectoryExpanded) {
    return 2
  }
  return 1
}
