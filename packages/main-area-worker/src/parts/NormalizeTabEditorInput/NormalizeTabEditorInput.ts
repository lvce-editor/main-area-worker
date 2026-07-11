import { getEditorInputEditorType } from '../GetEditorInputEditorType/GetEditorInputEditorType.ts'
import { getEditorInputUri } from '../GetEditorInputUri/GetEditorInputUri.ts'

const imageExtensions = new Set(['.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.tif', '.tiff', '.webp'])
const videoExtensions = new Set(['.avi', '.m4v', '.mkv', '.mov', '.mp4', '.mpeg', '.mpg', '.ogv', '.webm'])

const getPathEndIndex = (pathName: string): number => {
  const queryIndex = pathName.indexOf('?')
  const hashIndex = pathName.indexOf('#')
  if (queryIndex === -1) {
    return hashIndex === -1 ? pathName.length : hashIndex
  }
  if (hashIndex === -1) {
    return queryIndex
  }
  return Math.min(queryIndex, hashIndex)
}

const getPathName = (uri: string): string => {
  if (uri.startsWith('file://')) {
    try {
      return new URL(uri).pathname
    } catch {
      return uri
    }
  }
  return uri
}

const getLowerCaseExtension = (uri: string): string => {
  const pathName = getPathName(uri)
  const endIndex = getPathEndIndex(pathName)
  const cleanPath = pathName.slice(0, endIndex)
  const lastDotIndex = cleanPath.lastIndexOf('.')
  const lastSlashIndex = cleanPath.lastIndexOf('/')
  if (lastDotIndex === -1 || lastDotIndex < lastSlashIndex) {
    return ''
  }
  return cleanPath.slice(lastDotIndex).toLowerCase()
}

const getEditorInputFromUri = (uri: string): any => {
  if (uri.startsWith('diff://?')) {
    try {
      const parsed = new URL(uri)
      const uriLeft = parsed.searchParams.get('left')
      const uriRight = parsed.searchParams.get('right')
      if (uriLeft && uriRight) {
        return {
          type: 'diff-editor',
          uriLeft,
          uriRight,
        }
      }
    } catch {
      // Ignore malformed legacy URIs and fall back to a text editor input.
    }
  }

  if (uri.startsWith('extension-detail://')) {
    const extensionIdWithPath = uri.slice('extension-detail://'.length)
    const extensionId = extensionIdWithPath.split('/', 1)[0]
    if (extensionId) {
      return {
        extensionId,
        type: 'extension-detail-view',
      }
    }
  }

  if (uri.startsWith('process-explorer://')) {
    return {
      type: 'process-explorer',
    }
  }

  if (uri.startsWith('running-extensions://')) {
    return {
      type: 'running-extensions',
    }
  }

  const extension = getLowerCaseExtension(uri)
  if (imageExtensions.has(extension)) {
    return {
      type: 'image',
      uri,
    }
  }

  if (videoExtensions.has(extension)) {
    return {
      type: 'video',
      uri,
    }
  }

  return {
    type: 'editor',
    uri,
  }
}

const getNormalizedEditorInput = (tab: any): any => {
  const { editorInput: tabEditorInput, uri: tabUri } = tab ?? {}
  let uri
  if (typeof tabUri === 'string') {
    uri = tabUri
  } else if (typeof tabEditorInput?.uri === 'string') {
    const { uri: tabEditorInputUri } = tabEditorInput
    uri = tabEditorInputUri
  }
  if (uri) {
    const inferredEditorInput = getEditorInputFromUri(uri)
    if (inferredEditorInput.type !== 'editor') {
      return inferredEditorInput
    }
  }
  return tab?.editorInput
}

export const normalizeTabEditorInput = (tab: any): any => {
  const editorInput = getNormalizedEditorInput(tab)
  if (!editorInput) {
    return tab
  }

  const uri = typeof tab?.uri === 'string' ? tab.uri : getEditorInputUri(editorInput)

  return {
    ...tab,
    editorInput,
    editorType: getEditorInputEditorType(editorInput),
    uri,
  }
}

export const getNormalizedOpenEditorInput = (uri: string): any => {
  return getEditorInputFromUri(uri)
}
