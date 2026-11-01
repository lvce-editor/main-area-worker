import type { AsyncCommand, Fn, WrappedFn } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { registry } from '../MainAreaRegistry/MainAreaRegistry.ts'
import { updatePresentation, cancelPaintHolds } from '../PaintHold/PaintHold.ts'
import * as WithActiveEditorChange from '../WithActiveEditorChange/WithActiveEditorChange.ts'

const lifetimes = new Map<number, object>()

export const { get, getCommandIds, getKeys, registerCommands, wrapGetter } = registry

export const set: typeof registry.set = (uid, oldState, newState, scheduledState) => {
  const current = registry.get(uid)
  if (!current || (oldState === newState && newState !== current.newState)) lifetimes.set(uid, {})
  const presentedState = updatePresentation(current?.newState ?? oldState, newState)
  registry.set(uid, oldState, presentedState, scheduledState)
}

export const dispose = (uid: number): void => {
  cancelPaintHolds(uid)
  lifetimes.delete(uid)
  registry.dispose(uid)
}

export const clear = (): void => {
  for (const uid of registry.getKeys()) cancelPaintHolds(uid)
  registry.clear()
  lifetimes.clear()
}

const presentCommand =
  (fn: Fn<MainAreaState>): Fn<MainAreaState> =>
  async (state, ...args) => {
    const lifetime = lifetimes.get(state.uid)
    const newState = await fn(state, ...args)
    const instance = registry.get(state.uid)
    if (!instance || lifetime !== lifetimes.get(state.uid)) return newState
    const presentedState = updatePresentation(instance.newState, newState)
    // Publish before notifications: their RPCs may take longer than the hold.
    registry.set(state.uid, instance.oldState, presentedState)
    await WithActiveEditorChange.withActiveEditorChange(() => presentedState)(state)
    return registry.get(state.uid)?.newState ?? presentedState
  }

const presentAsyncCommand =
  (fn: AsyncCommand<MainAreaState>): AsyncCommand<MainAreaState> =>
  async (context, ...args) => {
    await fn(
      {
        getState: context.getState,
        updateState: (updater) => context.updateState((state) => updatePresentation(state, updater(state))),
      },
      ...args,
    )
  }

export const wrapAsyncCommand = (fn: AsyncCommand<MainAreaState>): WrappedFn => {
  return registry.wrapAsyncCommand(WithActiveEditorChange.withActiveEditorChangeAsync(presentAsyncCommand(fn)))
}

export const wrapCommand = (fn: Fn<MainAreaState>): WrappedFn => {
  return registry.wrapCommand(presentCommand(fn))
}

export const wrapSerialAsyncCommand = (fn: AsyncCommand<MainAreaState>): WrappedFn => {
  return registry.wrapSerialAsyncCommand(WithActiveEditorChange.withActiveEditorChangeAsync(presentAsyncCommand(fn)))
}

export const wrapSerialCommand = (fn: Fn<MainAreaState>): WrappedFn => {
  return registry.wrapSerialCommand(presentCommand(fn))
}
