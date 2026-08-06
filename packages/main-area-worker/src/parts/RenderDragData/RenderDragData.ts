import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

const ensureUri = (uri: string): string => {
  return uri.startsWith('/') ? `file://${uri}` : uri
}

export const renderDragData = (oldState: MainAreaState, newState: MainAreaState): readonly any[] => {
  const { layout, pointerDownGroupIndex, pointerDownTabIndex, uid } = newState
  const { groups } = layout
  if (pointerDownGroupIndex === -1 || pointerDownTabIndex === -1) {
    return []
  }
  const tab = groups[pointerDownGroupIndex]?.tabs[pointerDownTabIndex]
  if (!tab?.uri) {
    return []
  }
  const data = ensureUri(tab.uri)
  return [
    'Viewlet.setDragData',
    uid,
    {
      items: [
        { data, type: 'text/uri-list' },
        { data, type: 'text/plain' },
      ],
      label: tab.title,
    },
  ]
}
