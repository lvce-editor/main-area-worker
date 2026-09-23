import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

const ensureUri = (uri: string): string => {
  return uri.startsWith('/') ? `file://${uri}` : uri
}

export const renderDragData = (oldState: MainAreaState, newState: MainAreaState): readonly any[] => {
  const { layout, pointerDownGroupIndex, pointerDownTabIndex, uid } = newState
  const { groups } = layout
  if (pointerDownGroupIndex === -1 || pointerDownTabIndex === -1) {
    const oldTab = oldState.layout.groups[oldState.pointerDownGroupIndex]?.tabs[oldState.pointerDownTabIndex]
    return oldTab?.terminal ? ['Viewlet.setDragData', uid, { items: [], label: '' }] : []
  }
  const tab = groups[pointerDownGroupIndex]?.tabs[pointerDownTabIndex]
  if (!tab?.uri) {
    return []
  }
  if (tab.terminal) {
    return [
      'Viewlet.setDragData',
      uid,
      {
        items: [{ data: `lvce-terminal:${JSON.stringify({ sourceUid: uid, terminalUid: tab.editorUid })}`, type: 'application/x-lvce-terminal' }],
        label: tab.title,
      },
    ]
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
