import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { openUri, openUriWithContext } from '../OpenUri/OpenUri.ts'

export const openUris = async (state: MainAreaState, uris: readonly string[]): Promise<MainAreaState> => {
  let currentState = state
  for (const uri of uris) {
    currentState = await openUri(currentState, uri)
  }
  return currentState
}

export const openUrisWithContext = async (
  context: AsyncCommandContext<MainAreaState>,
  uris: readonly string[],
  reuseExisting: boolean = true,
): Promise<void> => {
  for (const uri of uris) {
    await openUriWithContext(context, { focus: true, reuseExisting, uri })
  }
}
