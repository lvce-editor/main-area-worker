import { PlatformType } from '@lvce-editor/constants'
import { getDroppedBrowserUris } from '../GetDroppedBrowserUris/GetDroppedBrowserUris.ts'
import { getDroppedElectronUris } from '../GetDroppedElectronUris/GetDroppedElectronUris.ts'

export const getDroppedUris = async (
  itemIds: readonly number[],
  files: FileList | readonly File[] = [],
  platform: number = PlatformType.Web,
): Promise<readonly string[]> => {
  if (platform === PlatformType.Electron && files.length > 0) {
    return getDroppedElectronUris(itemIds, files)
  }
  return getDroppedBrowserUris(itemIds)
}
