import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { openUri, openUriWithContext } from '../OpenUri/OpenUri.ts'
import { setEditorLayoutThreeColumns } from '../SetEditorLayout/SetEditorLayout.ts'

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

export const openUrisInThreeColumnsWithContext = async (context: AsyncCommandContext<MainAreaState>, uris: readonly string[]): Promise<void> => {
  if (uris.length !== 3) {
    throw new RangeError('Expected exactly three URIs')
  }

  await context.updateState(setEditorLayoutThreeColumns)
  const groups = context.getState().layout.groups
  for (const [index, uri] of uris.entries()) {
    const group = groups[index]
    if (!group) {
      throw new Error(`Missing editor group at index ${index}`)
    }
    await context.updateState((state) => focusEditorGroup(state, group.id))
    await openUriWithContext(context, { focus: index === uris.length - 1, uri })
  }
}
