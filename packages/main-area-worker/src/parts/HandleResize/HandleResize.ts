import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'

export const handleResize = async (state: MainAreaState, x: number, y: number, width: number, height: number): Promise<MainAreaState> => {
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)

  const newState = {
    ...state,
    height,
    width,
    x,
    y,
  }

  // Resize all editor children to their new bounds
  const { layout, tabHeight } = state
  const { groups } = layout
  const contentHeight = height - tabHeight

  for (const group of groups) {
    for (const tab of group.tabs) {
      if (tab.editorUid !== -1) {
        // @ts-ignore
        await RendererWorker.invoke('Viewlet.setBounds', tab.editorUid, { height: contentHeight, width, x, y: y + tabHeight })
      }
    }
  }

  return newState
}
