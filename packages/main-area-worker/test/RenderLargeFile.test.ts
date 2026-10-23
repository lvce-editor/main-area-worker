import { expect, test } from '@jest/globals'
import { renderLargeFile } from '../src/parts/RenderEditor/RenderLargeFile/RenderLargeFile.ts'

const getText = (fileSize: number): readonly string[] =>
  renderLargeFile(fileSize)
    .map((node) => node.text)
    .filter(Boolean) as string[]

test('renders byte sizes', () => {
  expect(getText(12)[0]).toBe('The file is not displayed in the text editor because it is very large (12 B).')
})

test('renders kilobyte sizes', () => {
  expect(getText(2048)[0]).toBe('The file is not displayed in the text editor because it is very large (2.00 KB).')
})

test('renders megabyte sizes and actions', () => {
  const rendered = renderLargeFile(2 * 1024 * 1024)
  expect(getText(2 * 1024 * 1024)).toEqual([
    'The file is not displayed in the text editor because it is very large (2.00 MB).',
    'Open Anyway',
    'Configure Limit',
  ])
  expect(rendered[5].childCount).toBe(2)
  expect(rendered[6].childCount).toBe(1)
  expect(rendered[7].text).toBe('Open Anyway')
  expect(rendered[8].childCount).toBe(1)
  expect(rendered[9].text).toBe('Configure Limit')
})
