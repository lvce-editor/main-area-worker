import { getEditorInputEditorType } from '../GetEditorInputEditorType/GetEditorInputEditorType.ts'

const getEditorInputFromUri = (uri: string): any => {
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
  if (typeof tab?.uri === 'string') {
    const inferredEditorInput = getEditorInputFromUri(tab.uri)
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

  return {
    ...tab,
    editorInput,
    editorType: getEditorInputEditorType(editorInput),
  }
}

export const getNormalizedOpenEditorInput = (uri: string): any => {
  return getEditorInputFromUri(uri)
}
