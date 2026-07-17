export const getRenamedUri = (uri: string, oldUri: string, newUri: string): string => {
  if (uri === oldUri) {
    return newUri
  }
  if (uri.startsWith(`${oldUri}/`) || uri.startsWith(`${oldUri}\\`)) {
    return `${newUri}${uri.slice(oldUri.length)}`
  }
  return uri
}
