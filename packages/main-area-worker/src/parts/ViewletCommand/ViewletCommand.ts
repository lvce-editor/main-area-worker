export interface Bounds {
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

interface ViewletCreateCommand {
  readonly bounds: Bounds
  readonly requestId: number
  readonly tabId: number
  readonly type: 'create'
  readonly uri: string | undefined
  readonly viewletModuleId: string
}

interface ViewletAttachCommand {
  readonly instanceId: number
  readonly type: 'attach'
}

interface ViewletDetachCommand {
  readonly instanceId: number
  readonly type: 'detach'
}

interface ViewletDisposeCommand {
  readonly instanceId: number
  readonly type: 'dispose'
}

interface ViewletSetBoundsCommand {
  readonly bounds: Bounds
  readonly instanceId: number
  readonly type: 'setBounds'
}

export type ViewletCommand = ViewletCreateCommand | ViewletAttachCommand | ViewletDetachCommand | ViewletDisposeCommand | ViewletSetBoundsCommand
