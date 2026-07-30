import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as GetMountedViewletUids from '../GetMountedViewletUids/GetMountedViewletUids.ts'

const arraysEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

export const notifyMountedViewlets = async (oldState: MainAreaState, newState: MainAreaState): Promise<void> => {
  const oldViewletUids = GetMountedViewletUids.getMountedViewletUids(oldState)
  const newViewletUids = GetMountedViewletUids.getMountedViewletUids(newState)
  if (oldState.uid === newState.uid && arraysEqual(oldViewletUids, newViewletUids)) {
    return
  }
  try {
    await RendererWorker.invoke('Layout.setMountedViewlets', newState.uid, newViewletUids)
  } catch (error) {
    console.warn('Failed to publish mounted viewlets', error)
  }
}
