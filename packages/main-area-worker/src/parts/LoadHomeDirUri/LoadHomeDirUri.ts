import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

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

export const loadHomeDirUri = async (applicationId?: string): Promise<string> => {
  try {
    const homeDir = await ApplicationRpc.invoke(applicationId, 'Workspace.getHomeDir')
    return typeof homeDir === 'string' ? toFileUri(homeDir) : ''
  } catch {
    return ''
  }
}
