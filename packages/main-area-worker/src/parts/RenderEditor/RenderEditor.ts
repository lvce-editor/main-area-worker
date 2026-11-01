import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as LoadingState from '../LoadingState/LoadingState.ts'
import { renderBinary } from './RenderBinary/RenderBinary.ts'
import { renderContent } from './RenderContent/RenderContent.ts'
import { renderError } from './RenderError/RenderError.ts'
import { renderLargeFile } from './RenderLargeFile/RenderLargeFile.ts'
import { renderLoading } from './RenderLoading/RenderLoading.ts'
import { renderViewletReference } from './RenderViewletReference/RenderViewletReference.ts'

export const renderEditor = (tab: Tab | undefined): readonly VirtualDomNode[] => {
  if (!tab) {
    // Keep backward compatible behavior: render empty content
    return renderContent('')
  }

  // Viewlet is being created in background - show loading
  if (tab.loadingState === LoadingState.Loading) {
    return renderLoading()
  }

  if (tab.loadingState === LoadingState.Binary) {
    return renderBinary()
  }

  if (tab.loadingState === LoadingState.Large && tab.fileSize !== undefined) {
    return renderLargeFile(tab.fileSize)
  }

  // Viewlet is ready - render a reference node
  // Frontend will append the pre-created component at this position using the uid
  // Check for viewletInstanceId to distinguish between viewlet and plain text tabs
  if (tab.loadingState === LoadingState.Loaded && tab.editorUid !== -1) {
    return renderViewletReference(tab)
  }

  // Viewlet error state
  if (tab.loadingState === LoadingState.Error && tab.errorMessage) {
    return renderError(tab.errorMessage)
  }

  if (tab.loadingState === LoadingState.Idle) {
    return renderContent('')
  }

  // Default: render content (fallback for simple text without viewlet)
  return renderContent('')
}
