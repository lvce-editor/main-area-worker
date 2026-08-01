const windowsDriveLetterRegex = /^[a-zA-Z]:\\/

const encodeFilePath = (path: string): string => {
  return encodeURI(path).replaceAll('#', '%23').replaceAll('?', '%3F')
}

export const toFileUri = (path: string): string => {
  if (path.startsWith('file://')) {
    return path
  }
  if (windowsDriveLetterRegex.test(path)) {
    const normalizedPath = path.replaceAll('\\', '/')
    return `file:///${encodeFilePath(normalizedPath)}`
  }
  return `file://${encodeFilePath(path)}`
}
