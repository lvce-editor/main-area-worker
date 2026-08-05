interface DropActionOpenFiles {
  readonly command: 'openFiles'
  readonly uris: readonly string[]
}

interface DropActionSetPath {
  readonly command: 'setPath'
  readonly value: string
}

interface DropActionSetUri {
  readonly command: 'setUri'
  readonly value: string
}

export type DropAction = DropActionOpenFiles | DropActionSetPath | DropActionSetUri
