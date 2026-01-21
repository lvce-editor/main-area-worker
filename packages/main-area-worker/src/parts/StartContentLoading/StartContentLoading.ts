import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as LoadTabContent from '../LoadTabContent/LoadTabContent.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'

export const startContentLoading = async (state: MainAreaState, tabId: number, path: string, requestId: number): Promise<MainAreaState> => {
  try {
    const getLatestState = (): MainAreaState => {
      return get(state.uid).newState
    }
    const newState = await LoadTabContent.loadTabContentAsync(tabId, path, requestId, getLatestState)
    const oldState = state
    set(state.uid, oldState, newState)
    // await RendererWorker.invoke('Main.refresh')
    return state
  } catch {
    // Silently ignore errors - the tab may have been closed or the component unmounted
  }
  return state
}
