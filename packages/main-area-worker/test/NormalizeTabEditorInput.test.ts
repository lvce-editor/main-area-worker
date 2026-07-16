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

test('normalizeTabEditorInput preserves an image explicitly reopened as text', () => {
  expect(
    normalizeTabEditorInput({
      editorInput: {
        forceText: true,
        type: 'editor',
        uri: 'file:///test/tiny.png',
      },
      editorType: 'text',
      uri: 'file:///test/tiny.png',
    }),
  ).toMatchObject({
    editorInput: {
      forceText: true,
      type: 'editor',
      uri: 'file:///test/tiny.png',
    },
    editorType: 'text',
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
