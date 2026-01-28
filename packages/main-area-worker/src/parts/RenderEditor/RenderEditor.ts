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

const renderViewletReference = (tab: Tab): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      type: 100, // Reference node type - frontend will append the component at this position
      uid: tab.editorUid,
    },
  ]
}

export const renderEditor = (tab: Tab | undefined): readonly VirtualDomNode[] => {
  if (!tab) {
    // Keep backward compatible behavior: render empty content
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

  // Viewlet is being created in background - show loading
  if (tab.loadingState === 'loading') {
    return renderLoading()
  }

  // Viewlet is ready - render a reference node
  // Frontend will append the pre-created component at this position using the uid
  if (tab.loadingState === 'loaded') {
    return renderViewletReference(tab)
  }

  // Viewlet error state
  if (tab.loadingState === 'error' && tab.errorMessage) {
    return renderError(tab.errorMessage)
  }

  // Default: render content (fallback for simple text without viewlet)
  return renderContent(tab.content || '')
}
