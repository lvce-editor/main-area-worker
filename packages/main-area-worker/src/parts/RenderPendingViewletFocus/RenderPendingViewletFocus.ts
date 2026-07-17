import { WhenExpression } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const renderPendingViewletFocus = (oldState: MainAreaState, newState: MainAreaState): readonly any[] => {
  const editorUid = newState.pendingViewletFocus
  newState.pendingViewletFocus = undefined
  return ['Viewlet.setFocusContext', editorUid, WhenExpression.FocusEditorText, 0, editorUid, 'Editor']
}
