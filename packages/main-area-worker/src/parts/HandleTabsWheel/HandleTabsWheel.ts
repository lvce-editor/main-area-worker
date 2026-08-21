import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const getPixelDelta = (state: MainAreaState, deltaMode: number, deltaY: number): number => {
  switch (deltaMode) {
    case 1:
      return deltaY * 16
    case 2:
      return deltaY * state.width
    default:
      return deltaY
  }
}

export const handleTabsWheel = async (state: MainAreaState, groupIndexRaw: string, deltaMode: number, deltaY: number): Promise<MainAreaState> => {
  if (!groupIndexRaw || deltaY === 0) {
    return state
  }
  const groupIndex = Number.parseInt(groupIndexRaw)
  if (!state.layout.groups[groupIndex]) {
    return state
  }
  const selector = `.${ClassNames.MainTabs}[data-group-index="${groupIndex}"]`
  const pixelDelta = getPixelDelta(state, deltaMode, deltaY)
  if (RendererProcess.isConnected()) {
    await RendererProcess.invoke('Viewlet.scrollSelectorBy', state.uid, selector, pixelDelta)
  } else {
    await RendererWorker.invoke('Viewlet.scrollSelectorBy', state.uid, selector, pixelDelta)
  }
  return state
}
