export const getRenamedUri = (uri: string | undefined, oldUri: string, newUri: string): string | undefined => {
  if (!uri || !oldUri) {
    return uri
  }
  if (uri === oldUri) {
    return newUri
  }
  if (uri.startsWith(`${oldUri}/`) || uri.startsWith(`${oldUri}\\`)) {
    return newUri + uri.slice(oldUri.length)
  }
  return uri
}
