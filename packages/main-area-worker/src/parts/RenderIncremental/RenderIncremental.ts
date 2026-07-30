import { PatchType, ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

const avoidRootReplacement = (patches: readonly any[]): readonly any[] => {
  if (patches.length !== 1 || patches[0].type !== PatchType.Add) {
    return patches
  }
  return [{ index: 0, type: PatchType.NavigateChild }, { type: PatchType.NavigateParent }, ...patches]
}

export const renderIncremental = (oldState: MainAreaState, newState: MainAreaState): any => {
  const oldDom = renderItems(oldState, oldState)[2]
  const newDom = renderItems(newState, newState)[2]
  const patches = avoidRootReplacement(diffTree(oldDom, newDom))
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
