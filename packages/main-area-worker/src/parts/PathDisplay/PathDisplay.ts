export const getTitle = (uri: string, homeDir: string): string => {
  if (!uri) {
    return ''
  }
  // TODO tree shake this out in web
  if (homeDir && uri.startsWith(homeDir)) {
    return `~${uri.slice(homeDir.length)}`
  }
  return uri
}

const getBasename = (uri: string): string => {
  const lastSlashIndex = uri.lastIndexOf('/')
  if (lastSlashIndex === -1) {
    return uri
  }
  return uri.slice(lastSlashIndex + 1)
}

export const getLabel = (uri: string): string => {
  if (uri.startsWith('settings://')) {
    return 'Settings'
  }
  if (uri.startsWith('simple-browser://')) {
    return 'Simple Browser'
  }
  return getBasename(uri)
}

/**
 *
 * @param {string} uri
 * @returns
 */
export const getFileIcon = (uri: string): string => {
  if (uri === 'app://keybindings') {
    return `MaskIconRecordKey`
  }
  if (uri.startsWith('extension-detail://')) {
    return `MaskIconExtensions`
  }
  return ''
}
