import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../MainAreaState/MainAreaState.ts'

const renderLoading = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'TextEditor TextEditor--loading',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--loading',
      type: VirtualDomElements.Div,
    },
    text('Loading...'),
  ]
}

const renderError = (errorMessage: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'TextEditor TextEditor--error',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--error',
      type: VirtualDomElements.Div,
    },
    text(`Error: ${errorMessage}`),
  ]
}

const renderContent = (content: string): readonly VirtualDomNode[] => {
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
    text(content),
  ]
}

export const renderEditor = (tab: Tab | undefined): readonly VirtualDomNode[] => {
  if (!tab) {
    return renderContent('')
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

  // Handle loading state
  if (tab.loadingState === 'loading') {
    return renderLoading()
  }

  // Handle error state
  if (tab.loadingState === 'error' && tab.errorMessage) {
    return renderError(tab.errorMessage)
  }

  // Default: render content
  return renderContent(tab.content || '')
}
