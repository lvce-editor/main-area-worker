import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getEditorGroupContentBounds } from '../GetEditorGroupBounds/GetEditorGroupBounds.ts'

const resizeChild = async (editorUid: number, dimensions: any): Promise<readonly any[]> => {
  try {
    return await RendererWorker.invoke('Viewlet.resize', editorUid, dimensions)
  } catch {
    return []
  }
}

export const handleResize = async (state: MainAreaState, dimensions: any): Promise<readonly any[]> => {
  // Resize all editor children to their new bounds
  const { layout, tabHeight } = state
  const { groups } = layout
  const groupBounds = getEditorGroupContentBounds(layout, dimensions, tabHeight)

  const resizePromises = []
  for (const group of groups) {
    const bounds = groupBounds.find((item) => item.groupId === group.id)
    if (!bounds) {
      continue
    }
    const dimensions = {
      height: bounds.height,
      width: bounds.width,
      x: bounds.x,
      y: bounds.y,
    }
    for (const tab of group.tabs) {
      if (tab.editorUid !== -1) {
        resizePromises.push(resizeChild(tab.editorUid, dimensions))
      }
    }
  }

  const resizeCommands = await Promise.all(resizePromises)
  return resizeCommands.flat()
}
