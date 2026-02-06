import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleResize = async (state: MainAreaState, dimensions: any): Promise<readonly any[]> => {
  const { height, width, x, y } = dimensions

  // TODO should update our local state also
  // @ts-ignore
  const newState = {
    ...state,
    height,
    width,
    x,
    y,
  }

  // Resize all editor children to their new bounds
  const { layout, tabHeight, uid } = state
  const { groups } = layout
  const contentHeight = height - tabHeight

  const allResizeCommands = []
  for (const group of groups) {
    for (const tab of group.tabs) {
      if (tab.editorUid !== -1) {
        try {
          const resizeCommands = await RendererWorker.invoke('Viewlet.resize', tab.editorUid, { height: contentHeight, width, x, y: y + tabHeight })
          allResizeCommands.push(...resizeCommands)
        } catch {
          // ignore
        }
      }
    }
  }

  allResizeCommands.push(['Viewlet.setBounds', uid, x, y, width, height])
  return allResizeCommands
}
