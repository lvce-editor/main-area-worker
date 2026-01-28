import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'

export const getOptionUriOptions = (options: OpenUriOptions | string): string => {
  let uri = ''
  if (typeof options === 'string') {
    uri = options
  } else {
    const { uri: optionsUri } = options
    uri = optionsUri
  }
  return uri
}
