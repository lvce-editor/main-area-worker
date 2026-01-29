import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { IconRequest } from '../IconRequest/IconRequest.ts'
import type { Tab } from '../Tab/Tab.ts'

const getBasename = (uri: string): string => {
  const lastSlashIndex = uri.lastIndexOf('/')
  if (lastSlashIndex === -1) {
    return uri
  }
  return uri.slice(lastSlashIndex + 1)
}

const getMissingTabs = (tabs: readonly Tab[], fileIconCache: FileIconCache): readonly Tab[] => {
  const missingTabs: Tab[] = []
  for (const tab of tabs) {
    if (tab.uri && !(tab.uri in fileIconCache)) {
      missingTabs.push(tab)
    }
  }
  return missingTabs
}

const tabToIconRequest = (tab: Tab): IconRequest => {
  const uri = tab.uri || ''
  return {
    name: getBasename(uri),
    path: uri,
    type: 0, // file type
  }
}

export const getMissingIconRequestsForTabs = (tabs: readonly Tab[], fileIconCache: FileIconCache): readonly IconRequest[] => {
  const missingRequests = getMissingTabs(tabs, fileIconCache)
  const iconRequests = missingRequests.map(tabToIconRequest)
  return iconRequests
}
