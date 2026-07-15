import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenInputOptions } from '../OpenInputOptions/OpenInputOptions.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import { getOptionUriOptions } from '../GetOptionUriOptions/GetOptionUriOptions.ts'
import { getNormalizedOpenEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'
import { openInput, openInputWithContext } from '../OpenInput/OpenInput.ts'

const getOpenInputOptions = (options: OpenUriOptions | string): OpenInputOptions => {
  const uri = getOptionUriOptions(options)
  const preview = typeof options === 'string' ? false : (options.preview ?? false)
  return {
    editorInput: getNormalizedOpenEditorInput(uri),
    focus: typeof options === 'string' ? false : options.focus,
    preview,
  }
}

export const openUri = async (state: MainAreaState, options: OpenUriOptions | string): Promise<MainAreaState> => {
  return openInput(state, getOpenInputOptions(options))
}

export const openUriWithContext = async (context: AsyncCommandContext<MainAreaState>, options: OpenUriOptions | string): Promise<void> => {
  await openInputWithContext(context, getOpenInputOptions(options))
}
