import { expect, test } from '@jest/globals'
import { getNormalizedOpenEditorInput, normalizeTabEditorInput } from '../src/parts/NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

test('getNormalizedOpenEditorInput returns image input for image files', () => {
  expect(getNormalizedOpenEditorInput('file:///test/tiny.png')).toEqual({
    type: 'image',
    uri: 'file:///test/tiny.png',
  })
  expect(getNormalizedOpenEditorInput('/test/tiny.SVG')).toEqual({
    type: 'image',
    uri: '/test/tiny.SVG',
  })
})

test('getNormalizedOpenEditorInput returns video input for video files', () => {
  expect(getNormalizedOpenEditorInput('file:///test/video.mp4')).toEqual({
    type: 'video',
    uri: 'file:///test/video.mp4',
  })
  expect(getNormalizedOpenEditorInput('/test/video.WEBM')).toEqual({
    type: 'video',
    uri: '/test/video.WEBM',
  })
})

test('getNormalizedOpenEditorInput keeps text files as editor input', () => {
  expect(getNormalizedOpenEditorInput('file:///test/file.ts')).toEqual({
    type: 'editor',
    uri: 'file:///test/file.ts',
  })
})

test.each(['archive.zip', 'archive.tar.gz', 'archive.tar.br', 'archive.tbr', 'document.pdf', 'module.beam'])(
  'getNormalizedOpenEditorInput returns binary input for %s',
  (fileName) => {
    const uri = `file:///test/${fileName}`
    expect(getNormalizedOpenEditorInput(uri)).toEqual({
      type: 'binary',
      uri,
    })
  },
)

test('getNormalizedOpenEditorInput detects binary file suffixes case-insensitively before query and hash suffixes', () => {
  const uri = 'file:///test/ARCHIVE.TAR.GZ?download=true#content'
  expect(getNormalizedOpenEditorInput(uri)).toEqual({
    type: 'binary',
    uri,
  })
})

test('normalizeTabEditorInput preserves an image explicitly reopened as text', () => {
  expect(
    normalizeTabEditorInput({
      editorInput: {
        forceText: true,
        type: 'editor',
        uri: 'file:///test/tiny.png',
      },
      uri: 'file:///test/tiny.png',
    }),
  ).toMatchObject({
    editorInput: {
      forceText: true,
      type: 'editor',
      uri: 'file:///test/tiny.png',
    },
  })
})

test('normalizeTabEditorInput preserves a binary file explicitly opened as text', () => {
  expect(
    normalizeTabEditorInput({
      editorInput: {
        forceText: true,
        type: 'editor',
        uri: 'file:///test/archive.zip',
      },
      uri: 'file:///test/archive.zip',
    }),
  ).toMatchObject({
    editorInput: {
      forceText: true,
      type: 'editor',
      uri: 'file:///test/archive.zip',
    },
  })
})

test('getNormalizedOpenEditorInput returns process explorer input for process explorer URIs', () => {
  expect(getNormalizedOpenEditorInput('process-explorer://')).toEqual({
    type: 'process-explorer',
  })
})

test('getNormalizedOpenEditorInput returns running extensions input for running extensions URIs', () => {
  expect(getNormalizedOpenEditorInput('running-extensions://')).toEqual({
    type: 'running-extensions',
  })
})

test('getNormalizedOpenEditorInput ignores query and hash suffixes when detecting media', () => {
  expect(getNormalizedOpenEditorInput('/test/image.png?size=large')).toEqual({
    type: 'image',
    uri: '/test/image.png?size=large',
  })
  expect(getNormalizedOpenEditorInput('/test/video.mp4#preview')).toEqual({
    type: 'video',
    uri: '/test/video.mp4#preview',
  })
  expect(getNormalizedOpenEditorInput('/test/image.svg#preview?size=large')).toEqual({
    type: 'image',
    uri: '/test/image.svg#preview?size=large',
  })
})

test('getNormalizedOpenEditorInput keeps extensionless paths and dotted directories as editor inputs', () => {
  expect(getNormalizedOpenEditorInput('/test/README')).toEqual({
    type: 'editor',
    uri: '/test/README',
  })
  expect(getNormalizedOpenEditorInput('/test.with.dot/README')).toEqual({
    type: 'editor',
    uri: '/test.with.dot/README',
  })
})

test('getNormalizedOpenEditorInput returns a diff editor input for a complete diff URI', () => {
  expect(getNormalizedOpenEditorInput('diff://?left=file%3A%2F%2F%2Fleft.ts&right=file%3A%2F%2F%2Fright.ts')).toEqual({
    type: 'diff-editor',
    uriLeft: 'file:///left.ts',
    uriRight: 'file:///right.ts',
  })
})

test('getNormalizedOpenEditorInput falls back to text for incomplete diff URIs', () => {
  expect(getNormalizedOpenEditorInput('diff://?left=file%3A%2F%2F%2Fleft.ts')).toEqual({
    type: 'editor',
    uri: 'diff://?left=file%3A%2F%2F%2Fleft.ts',
  })
})

test('getNormalizedOpenEditorInput returns extension detail inputs only when an id is present', () => {
  expect(getNormalizedOpenEditorInput('extension-detail://publisher.extension/readme')).toEqual({
    extensionId: 'publisher.extension',
    type: 'extension-detail-view',
  })
  expect(getNormalizedOpenEditorInput('extension-detail://')).toEqual({
    type: 'editor',
    uri: 'extension-detail://',
  })
})

test('normalizeTabEditorInput handles missing tabs and editor inputs', () => {
  expect(normalizeTabEditorInput(undefined)).toBeUndefined()
  const tab = {
    title: 'missing input',
  }
  expect(normalizeTabEditorInput(tab)).toBe(tab)
})

test('normalizeTabEditorInput infers media from an editor input uri', () => {
  expect(
    normalizeTabEditorInput({
      editorInput: {
        type: 'editor',
        uri: '/test/image.png',
      },
    }),
  ).toMatchObject({
    editorInput: {
      type: 'image',
      uri: '/test/image.png',
    },
    uri: '/test/image.png',
  })
})

test('normalizeTabEditorInput restores the binary placeholder state', () => {
  expect(
    normalizeTabEditorInput({
      editorUid: 42,
      uri: '/test/archive.zip',
    }),
  ).toMatchObject({
    editorInput: {
      type: 'binary',
      uri: '/test/archive.zip',
    },
    editorUid: -1,
    loadingState: 'binary',
  })
})

test.each([
  ['text', '/test/file.ts', 'editor'],
  ['custom', '/test/image.png', 'image'],
])('normalizeTabEditorInput migrates legacy %s tabs without retaining editorType', (editorType, uri, type) => {
  const tab = { editorType, uri }
  expect(normalizeTabEditorInput(tab)).toEqual({ editorInput: { type, uri }, uri })
  expect(tab).toEqual({ editorType, uri })
})

test('normalizeTabEditorInput removes editorType from legacy tabs without an input or uri', () => {
  expect(normalizeTabEditorInput({ editorType: 'text', title: 'File' })).toEqual({ title: 'File' })
})

test('normalizeTabEditorInput uses editorInput when the legacy editorType disagrees', () => {
  expect(normalizeTabEditorInput({ editorInput: { type: 'process-explorer' }, editorType: 'text' })).toEqual({
    editorInput: { type: 'process-explorer' },
    uri: 'process-explorer://',
  })
})
