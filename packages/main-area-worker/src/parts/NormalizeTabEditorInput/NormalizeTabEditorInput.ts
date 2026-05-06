import { getEditorInputEditorType } from '../GetEditorInputEditorType/GetEditorInputEditorType.ts'
import { getEditorInputUri } from '../GetEditorInputUri/GetEditorInputUri.ts'

export const getEditorInputFromUri = (uri: string): any => {
  if (uri.startsWith('diff://?')) {
    try {
      const parsed = new URL(uri)
      const uriLeft = parsed.searchParams.get('left')
      const uriRight = parsed.searchParams.get('right')
      if (uriLeft && uriRight) {
        return {
          type: 'diff-editor',
          uriLeft,
          uriRight,
        }
      }
    } catch {
      // Ignore malformed legacy URIs and fall back to a text editor input.
    }
  }

  if (uri.startsWith('extension-detail://')) {
    const extensionIdWithPath = uri.slice('extension-detail://'.length)
    const extensionId = extensionIdWithPath.split('/')[0]
    if (extensionId) {
      return {
        extensionId,
        type: 'extension-detail-view',
      }
    }
  }

  return {
    type: 'editor',
    uri,
  }
}

const getNormalizedEditorInput = (tab: any): any => {
  let uri
  if (typeof tab?.uri === 'string') {
    uri = tab.uri
  } else if (typeof tab?.editorInput?.uri === 'string') {
    uri = tab.editorInput.uri
  }
  if (uri) {
    const inferredEditorInput = getEditorInputFromUri(uri)
    if (inferredEditorInput.type !== 'editor') {
      return inferredEditorInput
    }
  }
  return tab?.editorInput
}

export const normalizeTabEditorInput = (tab: any): any => {
  const editorInput = getNormalizedEditorInput(tab)
  if (!editorInput) {
    return tab
  }

  const uri = typeof tab?.uri === 'string' ? tab.uri : getEditorInputUri(editorInput)

  return {
    ...tab,
    editorInput,
    editorType: getEditorInputEditorType(editorInput),
    uri,
  }
}

export const getNormalizedOpenEditorInput = (uri: string): any => {
  return getEditorInputFromUri(uri)
}
