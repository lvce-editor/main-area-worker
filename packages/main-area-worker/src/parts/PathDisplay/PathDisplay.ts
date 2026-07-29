export const getTitle = (uri: string, homeDir: string): string => {
  if (!uri) {
    return ''
  }
  const normalizedHomeDir = homeDir.endsWith('/') ? homeDir.slice(0, -1) : homeDir
  if (
    uri.startsWith('file://') &&
    normalizedHomeDir.startsWith('file://') &&
    (uri === normalizedHomeDir || uri.startsWith(`${normalizedHomeDir}/`))
  ) {
    return `~${uri.slice(normalizedHomeDir.length)}`
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

const inlineDiffPrefix = 'inline-diff://'
const diffSeparator = '<->'

const getInlineDiffLabel = (uri: string): string => {
  const content = uri.slice(inlineDiffPrefix.length)
  const separatorIndex = content.indexOf(diffSeparator)
  const workingTreeUri = separatorIndex === -1 ? content : content.slice(separatorIndex + diffSeparator.length)
  return `${getBasename(workingTreeUri)} (Working Tree)`
}

export const getLabel = (uri: string): string => {
  if (uri === 'app://keybindings') {
    return 'Keyboard Shortcuts'
  }
  if (uri.startsWith('settings://')) {
    return 'Settings'
  }
  if (uri.startsWith('simple-browser://')) {
    return 'Simple Browser'
  }
  if (uri.startsWith('chat-debug://')) {
    return 'Chat Debug'
  }
  if (uri.startsWith('language-models://')) {
    return 'Language Models'
  }
  if (uri.startsWith('process-explorer://')) {
    return 'Process Explorer'
  }
  if (uri.startsWith('running-extensions://')) {
    return 'Running Extensions'
  }
  if (uri.startsWith(inlineDiffPrefix)) {
    return getInlineDiffLabel(uri)
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
  if (uri.startsWith('process-explorer://')) {
    return `MaskIconDebugAlt2`
  }
  if (uri.startsWith('running-extensions://')) {
    return `MaskIconExtensions`
  }
  if (uri.startsWith('search-editor://')) {
    return `MaskIconSearch`
  }
  return ''
}
