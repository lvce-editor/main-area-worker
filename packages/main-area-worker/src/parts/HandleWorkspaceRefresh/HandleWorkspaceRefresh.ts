import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'

interface TextFileTab {
  readonly groupId: number
  readonly tabId: number
  readonly uri: string
}

const getTextFileTabs = (state: MainAreaState): readonly TextFileTab[] => {
  const tabs: TextFileTab[] = []
  for (const group of state.layout.groups) {
    for (const tab of group.tabs) {
      if (tab.editorInput?.type === 'editor') {
        tabs.push({
          groupId: group.id,
          tabId: tab.id,
          uri: tab.editorInput.uri,
        })
      }
    }
  }
  return tabs
}

const isMissing = async (tab: TextFileTab): Promise<boolean> => {
  try {
    const exists = await RendererWorker.invoke('FileSystem.exists', tab.uri)
    return exists === false
  } catch {
    return false
  }
}

export const handleWorkspaceRefresh = async (state: MainAreaState): Promise<MainAreaState> => {
  const tabs = getTextFileTabs(state)
  const missingResults = await Promise.all(tabs.map(isMissing))
  const missing = missingResults.map((isMissing, index) => (isMissing ? tabs[index] : undefined))

  let newState = state
  for (const tab of missing) {
    if (tab) {
      newState = await closeTabWithViewlet(newState, tab.groupId, tab.tabId)
    }
  }
  return newState
}
