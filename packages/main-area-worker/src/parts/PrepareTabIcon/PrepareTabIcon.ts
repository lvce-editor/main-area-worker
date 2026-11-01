import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { requestFileIcons } from '../RequestFileIcons/RequestFileIcons.ts'

export const prepareTabIcon = async (context: AsyncCommandContext<MainAreaState>, uri: string): Promise<{ icon: string; state: MainAreaState }> => {
  const state = context.getState()
  let icon = PathDisplay.getFileIcon(uri) || state.fileIconCache[uri] || ''
  if (!icon && uri && !(uri in state.fileIconCache)) {
    try {
      const icons = await requestFileIcons([{ name: uri.slice(uri.lastIndexOf('/') + 1), path: uri, type: DirentType.File }])
      icon = icons[0] || ''
    } catch {
      // Icon failures must not prevent opening the file. The reserved slot keeps its title stable.
    }
  }
  const latestState = context.getState()
  if (latestState.iconThemeVersion !== state.iconThemeVersion) {
    return prepareTabIcon(context, uri)
  }
  return { icon, state: latestState }
}
