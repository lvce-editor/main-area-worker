import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

const resizeChild = async (editorUid: number, dimensions: any): Promise<readonly any[]> => {
  try {
    return await RendererWorker.invoke('Viewlet.resize', editorUid, dimensions)
  } catch {
    return []
  }
}

export const handleResize = async (state: MainAreaState, dimensions: any): Promise<readonly any[]> => {
  const { height, width, x, y } = dimensions

  // Resize all editor children to their new bounds
  const { layout, tabHeight } = state
  const { groups } = layout
  const contentHeight = height - tabHeight

  const resizePromises = []
  const tabs = groups.flatMap((group) => group.tabs)
  for (const tab of tabs) {
    if (tab.editorUid === -1) {
      continue
    }
    const resizePromise = resizeChild(tab.editorUid, {
      height: contentHeight,
      width,
      x,
      y: y + tabHeight,
    })
    resizePromises.push(resizePromise)
  }

  const resizeCommands = await Promise.all(resizePromises)
  return resizeCommands.flat()
}
