import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenInputOptions } from '../OpenInputOptions/OpenInputOptions.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import { getOptionUriOptions } from '../GetOptionUriOptions/GetOptionUriOptions.ts'
import { getNormalizedOpenEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'
import { openInput, openInputWithContext } from '../OpenInput/OpenInput.ts'

const getViewletContext = (options: OpenUriOptions | string, viewletContext?: unknown): unknown => {
  if (viewletContext !== undefined || typeof options === 'string') {
    return viewletContext
  }
  const context = Object.fromEntries(
    Object.entries(options).filter(([key]) => key !== 'focus' && key !== 'preview' && key !== 'reuseExisting' && key !== 'uri'),
  )
  return Object.keys(context).length === 0 ? undefined : context
}

const getOpenInputOptions = (options: OpenUriOptions | string, focus = true, viewletContext?: unknown): OpenInputOptions => {
  const uri = getOptionUriOptions(options)
  const preview = typeof options === 'string' ? false : (options.preview ?? false)
  const reuseExisting = typeof options === 'string' ? true : (options.reuseExisting ?? true)
  const context = getViewletContext(options, viewletContext)
  return {
    ...(context !== undefined && { args: [context] }),
    editorInput: getNormalizedOpenEditorInput(uri),
    focus: typeof options === 'string' ? focus : options.focus,
    preview,
    reuseExisting,
  }
}

export const openUri = async (
  state: MainAreaState,
  options: OpenUriOptions | string,
  focus = true,
  viewletContext?: unknown,
): Promise<MainAreaState> => {
  return openInput(state, getOpenInputOptions(options, focus, viewletContext))
}

export const openUriWithContext = async (
  context: AsyncCommandContext<MainAreaState>,
  options: OpenUriOptions | string,
  focus = true,
  viewletContext?: unknown,
): Promise<void> => {
  await openInputWithContext(context, getOpenInputOptions(options, focus, viewletContext))
}
