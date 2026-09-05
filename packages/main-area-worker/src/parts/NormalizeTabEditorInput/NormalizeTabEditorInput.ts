import { getEditorInputUri } from '../GetEditorInputUri/GetEditorInputUri.ts'

const imageExtensions = new Set(['.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.tif', '.tiff', '.webp'])
const videoExtensions = new Set(['.avi', '.m4v', '.mkv', '.mov', '.mp4', '.mpeg', '.mpg', '.ogv', '.webm'])
const binaryFileSuffixes = [
  '.7z',
  '.apk',
  '.beam',
  '.br',
  '.bz2',
  '.deb',
  '.gz',
  '.jar',
  '.pdf',
  '.rar',
  '.rpm',
  '.tar',
  '.tar.br',
  '.tar.bz2',
  '.tar.gz',
  '.tar.xz',
  '.tar.zst',
  '.tbr',
  '.tgz',
  '.war',
  '.xz',
  '.zip',
  '.zst',
]

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
  if (uri.startsWith('file://') && URL.canParse(uri)) {
    return new URL(uri).pathname
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

const hasBinaryFileSuffix = (uri: string): boolean => {
  const pathName = getPathName(uri)
  const endIndex = getPathEndIndex(pathName)
  const cleanPath = pathName.slice(0, endIndex).toLowerCase()
  return binaryFileSuffixes.some((suffix) => cleanPath.endsWith(suffix))
}

const getEditorInputFromUri = (uri: string): any => {
  if (uri.startsWith('diff://?') && URL.canParse(uri)) {
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

  if (hasBinaryFileSuffix(uri)) {
    return {
      type: 'binary',
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
  if ((tabEditorInput?.type === 'editor' && tabEditorInput.forceText) || tabEditorInput?.type === 'webview') {
    return tabEditorInput
  }
  let uri
  if (typeof tabUri === 'string') {
    uri = tabUri
  } else if (typeof tabEditorInput?.uri === 'string') {
    const { uri: tabEditorInputUri } = tabEditorInput
    uri = tabEditorInputUri
  }
  if (uri) {
    const inferredEditorInput = getEditorInputFromUri(uri)
    if (inferredEditorInput.type !== 'editor' || !tabEditorInput) {
      return inferredEditorInput
    }
  }
  return tab?.editorInput
}

export const normalizeTabEditorInput = (tab: any): any => {
  if (!tab) {
    return tab
  }
  const { editorType: _editorType, ...rest } = tab
  const editorInput = getNormalizedEditorInput(rest)
  if (!editorInput) {
    return Object.hasOwn(tab, 'editorType') ? rest : tab
  }

  const uri = typeof tab?.uri === 'string' ? tab.uri : getEditorInputUri(editorInput)

  return {
    ...rest,
    editorInput,
    ...(editorInput.type === 'binary' && {
      editorUid: -1,
      loadingState: 'binary',
    }),
    uri,
  }
}

export const getNormalizedOpenEditorInput = (uri: string): any => {
  return getEditorInputFromUri(uri)
}
