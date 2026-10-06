import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import { tryRestoreLayout } from '../TryRestoreLayout/TryRestoreLayout.ts'
import { updateTabUriTitles } from '../UpdateTabUriTitles/UpdateTabUriTitles.ts'

// Restore the shell without depending on any editor, workspace, or icon RPC.
export const loadContentShell = (state: MainAreaState, savedState: unknown): MainAreaState => {
  const layout = tryRestoreLayout(savedState) ?? { activeGroupId: -1, direction: LayoutDirection.Horizontal, groups: [] }
  const { groups } = layout
  Id.reserve(groups.flatMap((group) => [group.id, ...group.tabs.map((tab) => tab.id)]))
  return updateTabUriTitles({
    ...state,
    initial: false,
    layout: {
      ...layout,
      groups: groups.map((group) => ({
        ...group,
        tabs: group.tabs.map((tab) => {
          if (tab.id !== group.activeTabId || !tab.uri || tab.loadingState === 'binary') {
            return tab
          }
          return { ...tab, editorUid: Id.create(), loadingState: 'loading' }
        }),
      })),
    },
  })
}
