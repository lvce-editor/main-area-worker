import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../../MainAreaState/MainAreaState.ts'

export const renderEditor = (tab: Tab | undefined): readonly VirtualDomNode[] => {
  if (!tab) {
    return [text('Tab not found')]
  }
  if (tab.editorType === 'custom') {
    return [
      {
        childCount: 1,
        className: 'CustomEditor',
        type: VirtualDomElements.Div,
      },
      text(`Custom Editor: ${tab.customEditorId}`),
    ]
  }

  return [
    {
      childCount: 1,
      className: 'TextEditor',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent',
      type: VirtualDomElements.Pre,
    },
    text(tab.content || ''),
  ]
}
