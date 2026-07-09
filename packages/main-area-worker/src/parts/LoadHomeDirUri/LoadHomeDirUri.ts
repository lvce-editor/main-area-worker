import { RendererWorker } from '@lvce-editor/rpc-registry'

const toFileUri = (path: string): string => {
  if (!path) {
    return ''
  }
  if (path.startsWith('file://')) {
    return path
  }
  if (path.startsWith('/')) {
    return `file://${path}`
  }
  return path
}

export const loadHomeDirUri = async (): Promise<string> => {
  try {
    const homeDir = await RendererWorker.invoke('Workspace.getHomeDir')
    return typeof homeDir === 'string' ? toFileUri(homeDir) : ''
  } catch {
    return ''
  }
}
