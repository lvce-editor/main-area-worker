const lineSeparatorRegex = /\r?\n/

export const parseUriList = (value: string): readonly string[] => {
  return value
    .split(lineSeparatorRegex)
    .map((uri) => uri.trim())
    .filter((uri) => uri && !uri.startsWith('#'))
}
