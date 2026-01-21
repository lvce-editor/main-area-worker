import { expect, test } from '@jest/globals'
import * as PathDisplay from '../src/parts/PathDisplay/PathDisplay.ts'

test('getTitle should return empty string for empty uri', () => {
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle('', '/home/user')
  expect(result).toBe('')
})

test('getTitle should return uri when homeDir is empty', () => {
  const uri: string = '/some/path/file.txt'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, '')
  expect(result).toBe(uri)
})

test('getTitle should return uri when uri does not start with homeDir', () => {
  const uri: string = '/other/path/file.txt'
  const homeDir: string = '/home/user'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe(uri)
})

test('getTitle should replace homeDir with ~ when uri starts with homeDir', () => {
  const homeDir: string = '/home/user'
  const uri: string = '/home/user/documents/file.txt'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe('~/documents/file.txt')
})

test('getTitle should handle exact match with homeDir', () => {
  const homeDir: string = '/home/user'
  const uri: string = '/home/user'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe('~')
})

test('getTitle should handle uri that is just homeDir with trailing slash', () => {
  const homeDir: string = '/home/user'
  const uri: string = '/home/user/'
  const result: ReturnType<typeof PathDisplay.getTitle> = PathDisplay.getTitle(uri, homeDir)
  expect(result).toBe('~/')
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
