import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as LoadTabContent from '../LoadTabContent/LoadTabContent.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'

export const startContentLoading = (uid: number, tabId: number, path: string, requestId: number): void => {
  const loadContent = async (): Promise<void> => {
    try {
      const currentState = get(uid) as unknown as MainAreaState | undefined
      if (!currentState) {
        return
      }
      const getLatestState = (): MainAreaState => (get(uid) as unknown as MainAreaState | undefined) ?? currentState
      const newState = await LoadTabContent.loadTabContentAsync(tabId, path, requestId, getLatestState)
      const oldState = get(uid) as unknown as MainAreaState | undefined
      if (oldState) {
        set(uid, oldState, newState)
      }
      await RendererWorker.invoke('Main.refresh')
    } catch {
      // Silently ignore errors - the tab may have been closed or the component unmounted
    }
  }
  void loadContent()
}
