import type { CursorPosition } from '../CursorPosition/CursorPosition.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'

export const applyInitialCursorPosition = async (state: MainAreaState, tabId: number, position?: CursorPosition): Promise<void> => {
  if (!position) {
    return
  }
  const tab = findTabById(state, tabId)?.tab
  if (!tab || tab.editorUid < 0 || tab.loadingState !== 'loaded' || tab.editorInput?.type !== 'editor') {
    return
  }
  await ApplicationRpc.invoke(
    state.applicationId,
    'Viewlet.executeViewletCommand',
    tab.editorUid,
    'cursorSet',
    position.rowIndex,
    position.columnIndex,
  )
}
