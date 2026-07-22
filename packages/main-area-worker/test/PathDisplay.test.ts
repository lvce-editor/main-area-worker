import { expect, test } from '@jest/globals'
import * as PathDisplay from '../src/parts/PathDisplay/PathDisplay.ts'

test('getTitle should return empty string for empty uri', () => {
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle('', 'file:///home/user')
  expect(result).toBe('')
})

test('getTitle should return uri when homeDir is empty', () => {
  const uri: string = 'file:///some/path/file.txt'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, '')
  expect(result).toBe(uri)
})

test('getTitle should return uri when uri does not start with homeDir', () => {
  const uri: string = 'file:///other/path/file.txt'
  const homeDir: string = 'file:///home/user'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe(uri)
})

test('getTitle should replace homeDir uri with ~ when file uri starts with homeDir uri', () => {
  const homeDir: string = 'file:///home/user'
  const uri: string = 'file:///home/user/documents/file.txt'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe('~/documents/file.txt')
})

test('getTitle should handle exact match with homeDir', () => {
  const homeDir: string = 'file:///home/user'
  const uri: string = 'file:///home/user'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe('~')
})

test('getTitle should handle uri that is just homeDir with trailing slash', () => {
  const homeDir: string = 'file:///home/user'
  const uri: string = 'file:///home/user/'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe('~/')
})

test('getTitle should not replace plain paths', () => {
  const homeDir: string = 'file:///home/user'
  const uri: string = '/home/user/documents/file.txt'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe(uri)
})

test('getTitle should not replace similar sibling paths', () => {
  const homeDir: string = 'file:///home/user'
  const uri: string = 'file:///home/user2/documents/file.txt'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe(uri)
})

test('getLabel should return Settings for settings:// uri', () => {
  const uri: string = 'settings://general'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('Settings')
})

test('getLabel should return Settings for settings:// uri with path', () => {
  const uri: string = 'settings://editor/preferences'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('Settings')
})

test('getLabel should return Simple Browser for simple-browser:// uri', () => {
  const uri: string = 'simple-browser://example.com'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('Simple Browser')
})

test('getLabel should return Simple Browser for simple-browser:// uri with path', () => {
  const uri: string = 'simple-browser://example.com/page'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('Simple Browser')
})

test('getLabel should return Process Explorer for process-explorer:// uri', () => {
  const uri: string = 'process-explorer://'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('Process Explorer')
})

test('getLabel should return Process Explorer for process-explorer:// uri with path', () => {
  const uri: string = 'process-explorer://main'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('Process Explorer')
})

test('getLabel should return Running Extensions for running-extensions:// uri', () => {
  expect(PathDisplay.getLabel('running-extensions://')).toBe('Running Extensions')
})

test('getLabel should return Keyboard Shortcuts for app://keybindings', () => {
  const uri: string = 'app://keybindings'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('Keyboard Shortcuts')
})

test('getLabel should return basename for regular file path', () => {
  const uri: string = '/path/to/file.txt'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('file.txt')
})

test('getLabel should return empty string for empty uri', () => {
  const uri: string = ''
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('')
})

test('getLabel should return basename for other protocol schemes', () => {
  const uri: string = 'file:///path/to/file.txt'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('file.txt')
})

test('getLabel should return working tree label for inline diff uri', () => {
  const uri: string = 'inline-diff://data://before<->/path/to/file.txt'
  const result: ReturnType<typeof PathDisplay.getLabel> = PathDisplay.getLabel(uri)
  expect(result).toBe('file.txt (Working Tree)')
})

test('getFileIcon should return MaskIconRecordKey for app://keybindings', () => {
  const uri: string = 'app://keybindings'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('MaskIconRecordKey')
})

test('getFileIcon should return MaskIconExtensions for extension-detail:// uri', () => {
  const uri: string = 'extension-detail://extension-id'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('MaskIconExtensions')
})

test('getFileIcon should return MaskIconExtensions for extension-detail:// uri with path', () => {
  const uri: string = 'extension-detail://extension-id/details'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('MaskIconExtensions')
})

test('getFileIcon should return MaskIconDebugAlt2 for process-explorer:// uri', () => {
  const uri: string = 'process-explorer://'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('MaskIconDebugAlt2')
})

test('getFileIcon should return MaskIconDebugAlt2 for process-explorer:// uri with path', () => {
  const uri: string = 'process-explorer://main'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('MaskIconDebugAlt2')
})

test('getFileIcon should return MaskIconExtensions for running-extensions:// uri', () => {
  expect(PathDisplay.getFileIcon('running-extensions://')).toBe('MaskIconExtensions')
})

test('getFileIcon should return MaskIconSearch for search-editor:// uri', () => {
  expect(PathDisplay.getFileIcon('search-editor://42-123/Search')).toBe('MaskIconSearch')
})

test('getFileIcon should return empty string for regular file path', () => {
  const uri: string = '/path/to/file.txt'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('')
})

test('getFileIcon should return empty string for empty uri', () => {
  const uri: string = ''
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('')
})

test('getFileIcon should return empty string for other protocol schemes', () => {
  const uri: string = 'file:///path/to/file.txt'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('')
})

test('getFileIcon should return empty string for settings:// uri', () => {
  const uri: string = 'settings://general'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('')
})

test('getFileIcon should return empty string for simple-browser:// uri', () => {
  const uri: string = 'simple-browser://example.com'
  const result: ReturnType<typeof PathDisplay.getFileIcon> = PathDisplay.getFileIcon(uri)
  expect(result).toBe('')
})
