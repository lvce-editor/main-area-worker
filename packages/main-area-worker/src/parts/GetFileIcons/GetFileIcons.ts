import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { FileIconsResult } from '../FileIconsRequest/FileIconsResult.ts'
import type { Tab } from '../Tab/Tab.ts'
import * as GetFileIconsCached from '../GetFileIconsCached/GetFileIconsCached.ts'
import * as GetMissingIconRequests from '../GetMissingIconRequests/GetMissingIconRequests.ts'
import * as RequestFileIcons from '../RequestFileIcons/RequestFileIcons.ts'
import * as UpdateIconCache from '../UpdateIconCache/UpdateIconCache.ts'

export const getFileIconsForTabs = async (tabs: readonly Tab[], fileIconCache: FileIconCache): Promise<FileIconsResult> => {
  const missingRequests = GetMissingIconRequests.getMissingIconRequestsForTabs(tabs, fileIconCache)
  const newIcons = await RequestFileIcons.requestFileIcons(missingRequests)
  const newFileIconCache = UpdateIconCache.updateIconCache(fileIconCache, missingRequests, newIcons)
  const tabUris = tabs.map((tab) => tab.uri || '')
  const icons = GetFileIconsCached.getIconsCached(tabUris, newFileIconCache)
  return {
    icons,
    newFileIconCache,
  }
}
