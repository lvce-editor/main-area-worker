import type { AsyncCommand, Fn, WrappedFn } from '@lvce-editor/viewlet-registry'
import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as WithActiveEditorChange from '../WithActiveEditorChange/WithActiveEditorChange.ts'

const registry = ViewletRegistry.create<MainAreaState>()

export const { clear, get, getCommandIds, getKeys, registerCommands, set, wrapGetter } = registry

export const wrapAsyncCommand = (fn: AsyncCommand<MainAreaState>): WrappedFn => {
  return registry.wrapAsyncCommand(WithActiveEditorChange.withActiveEditorChangeAsync(fn))
}

export const wrapSerialAsyncCommand = (fn: AsyncCommand<MainAreaState>): WrappedFn => {
  return registry.wrapSerialAsyncCommand(WithActiveEditorChange.withActiveEditorChangeAsync(fn))
}

export const wrapSerialCommand = (fn: Fn<MainAreaState>): WrappedFn => {
  return registry.wrapSerialCommand(WithActiveEditorChange.withActiveEditorChange(fn))
}
