import { WhenExpression } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const renderPendingViewletUpdate = (oldState: MainAreaState, newState: MainAreaState): readonly any[] => {
  const update = newState.pendingViewletUpdate
  newState.pendingViewletUpdate = undefined
  setTimeout(() => {
    void RendererWorker.invoke('Viewlet.dispose', update!.disposal).catch(() => {})
  }, 50)
  return update!.focus === undefined ? [] : ['Viewlet.setFocusContext', update!.focus, WhenExpression.FocusEditorText, 0, update!.focus, 'Editor']
}
