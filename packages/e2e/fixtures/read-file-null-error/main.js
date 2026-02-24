const contents = Object.create(null)

const fileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
  },
  rename(oldUri, newUri) {},
  readFile(uri) {
    throw null
  },
  pathSeparator: '/',
  readDirWithFileTypes(uri) {
    const results = []
    for (const [key, value] of Object.entries(contents)) {
      if (key.startsWith(uri)) {
        results.push({
          type: 7,
          name: key.slice(key.lastIndexOf('/')),
        })
      }
    }
    return results
  },
  remove(uri) {
    throw new Error(`oops`)
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
