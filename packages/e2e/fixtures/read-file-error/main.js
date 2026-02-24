const contents = Object.create(null)

contents['/test.txt'] = 'Hello WOrld'

let i = 0

class FileNotFoundError extends Error {
  constructor(uri) {
    super(`File not found`)
    this.name = 'FileNotFoundError'
    this.code = 'ENOENT'
  }
}

const fileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    contents[uri] = content
  },
  rename(oldUri, newUri) {},
  readFile(uri) {
    if (i++ === 0) {
      throw new FileNotFoundError(uri)
    }
    return contents[uri]
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
