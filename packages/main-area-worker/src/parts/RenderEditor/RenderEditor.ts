import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import { renderContent } from './RenderContent/RenderContent.ts'
import { renderError } from './RenderError/RenderError.ts'
import { renderLoading } from './RenderLoading/RenderLoading.ts'
import { renderViewletReference } from './RenderViewletReference/RenderViewletReference.ts'

export { renderContent } from './RenderContent/RenderContent.ts'
export { renderError } from './RenderError/RenderError.ts'
export { renderLoading } from './RenderLoading/RenderLoading.ts'
export { renderViewletReference } from './RenderViewletReference/RenderViewletReference.ts'

export const renderEditor = (tab: Tab | undefined): readonly VirtualDomNode[] => {
  if (!tab) {
    // Keep backward compatible behavior: render empty content
    return renderContent('')
  }

  // Viewlet is being created in background - show loading
  if (tab.loadingState === 'loading') {
    return renderLoading()
  }

  // Viewlet is ready - render a reference node
  // Frontend will append the pre-created component at this position using the uid
  // Check for viewletInstanceId to distinguish between viewlet and plain text tabs
  if (tab.loadingState === 'loaded' && tab.editorUid !== -1) {
    return renderViewletReference(tab)
  }

  // Viewlet error state
  if (tab.loadingState === 'error' && tab.errorMessage) {
    return renderError(tab.errorMessage)
  }

  // Default: render content (fallback for simple text without viewlet)
  return renderContent(tab.content || '')
}
