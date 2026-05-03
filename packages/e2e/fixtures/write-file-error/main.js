const contents = Object.create(null)

contents['/save-error.txt'] = 'Hello World'

class ReadOnlyFileSystemError extends Error {
  constructor(uri) {
    super(`EACCES: permission denied, open '${uri}'`)
    this.name = 'ReadOnlyFileSystemError'
    this.code = 'EACCES'
  }
}

const fileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    void content
    throw new ReadOnlyFileSystemError(uri)
  },
  rename(oldUri, newUri) {
    void oldUri
    void newUri
  },
  readFile(uri) {
    return contents[uri]
  },
  pathSeparator: '/',
  readDirWithFileTypes(uri) {
    const results = []
    for (const key of Object.keys(contents)) {
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
    throw new Error(`Cannot remove ${uri}`)
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
