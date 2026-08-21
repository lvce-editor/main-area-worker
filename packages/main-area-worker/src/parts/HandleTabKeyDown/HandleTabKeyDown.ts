import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'

const getFocusIndex = (key: string, index: number, tabCount: number): number => {
  switch (key) {
    case 'ArrowLeft':
      return (index + tabCount - 1) % tabCount
    case 'ArrowRight':
      return (index + 1) % tabCount
    case 'End':
      return tabCount - 1
    case 'Home':
      return 0
    default:
      return -1
  }
}

const focusTab = async (state: MainAreaState, groupIndex: number, index: number): Promise<void> => {
  const selector = `.${ClassNames.MainTab}[data-group-index="${groupIndex}"][data-index="${index}"]`
  if (RendererProcess.isConnected()) {
    await RendererProcess.invoke('Viewlet.focusSelector', state.uid, selector)
  } else {
    await RendererWorker.invoke('Viewlet.focusSelector', state.uid, selector)
  }
}

export const handleTabKeyDown = async (state: MainAreaState, groupIndexRaw: string, indexRaw: string, key: string): Promise<MainAreaState> => {
  if (!groupIndexRaw || !indexRaw) {
    return state
  }
  const groupIndex = Number.parseInt(groupIndexRaw)
  const index = Number.parseInt(indexRaw)
  const group = state.layout.groups[groupIndex]
  if (!group || index < 0 || index >= group.tabs.length) {
    return state
  }
  if ([' ', 'Enter', 'Space'].includes(key)) {
    return selectTab(state, groupIndex, index)
  }
  const focusIndex = getFocusIndex(key, index, group.tabs.length)
  if (focusIndex === -1) {
    return state
  }
  await focusTab(state, groupIndex, focusIndex)
  return state
}
