import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { openUri } from '../OpenUri/OpenUri.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'

export const openUris = async (state: MainAreaState, uris: readonly string[]): Promise<MainAreaState> => {
  if (uris.length === 0) {
    return state
  }

  if (uris.length === 1) {
    return openUri(state, uris[0])
  }

  let currentState = await openUri(state, uris[0])
  const firstTab = findTabByUri(currentState, uris[0])

  for (const uri of uris.slice(1)) {
    const existingTab = findTabByUri(currentState, uri)
    if (existingTab) {
      continue
    }
    currentState = ensureActiveGroup(currentState, uri)
  }

  if (!firstTab) {
    return currentState
  }

  return switchTab(currentState, firstTab.groupId, firstTab.tab.id)
}