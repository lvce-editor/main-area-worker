import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { scheduleViewletDisposal } from '../ScheduleViewletDisposal/ScheduleViewletDisposal.ts'

export const renderPendingViewletDisposal = (oldState: MainAreaState, newState: MainAreaState): readonly any[] => {
  const editorUid = newState.pendingViewletDisposal
  newState.pendingViewletDisposal = undefined
  if (editorUid !== undefined) {
    scheduleViewletDisposal(editorUid)
  }
  return []
}
