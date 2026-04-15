import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'

export const getOptionUriOptions = (options: OpenUriOptions | string): string => {
  if (typeof options === 'string') {
    return options
  }
  return options.uri
}
