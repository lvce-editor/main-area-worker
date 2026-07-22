import type { AsyncCommand, AsyncCommandContext, Fn } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as NotifyActiveEditorChange from '../NotifyActiveEditorChange/NotifyActiveEditorChange.ts'

export const withActiveEditorChange = (fn: Fn<MainAreaState>): Fn<MainAreaState> => {
  return async (state, ...args) => {
    const newState = await fn(state, ...args)
    await NotifyActiveEditorChange.notifyActiveEditorChange(state, newState)
    return newState
  }
}

export const withActiveEditorChangeAsync = (fn: AsyncCommand<MainAreaState>): AsyncCommand<MainAreaState> => {
  return async (context: AsyncCommandContext<MainAreaState>, ...args) => {
    const oldState = context.getState()
    await fn(context, ...args)
    const newState = context.getState()
    await NotifyActiveEditorChange.notifyActiveEditorChange(oldState, newState)
  }
}
