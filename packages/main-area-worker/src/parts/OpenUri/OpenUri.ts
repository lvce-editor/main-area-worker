import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import { getOptionUriOptions } from '../GetOptionUriOptions/GetOptionUriOptions.ts'
import { getNormalizedOpenEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'
import { openInput } from '../OpenInput/OpenInput.ts'

export const openUri = async (state: MainAreaState, options: OpenUriOptions | string): Promise<MainAreaState> => {
  const uri = getOptionUriOptions(options)
  const preview = typeof options === 'string' ? false : (options.preview ?? false)
  return openInput(state, {
    editorInput: getNormalizedOpenEditorInput(uri),
    focu: typeof options === 'string' ? false : options.focu,
    preview,
  })
}
