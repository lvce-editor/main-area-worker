import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getViewletModuleIdForEditorInput } from '../src/parts/GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.ts'

test('getViewletModuleIdForEditorInput resolves image and video modules', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async (uri: string) => (uri.endsWith('.png') ? 'ImagePreview' : 'VideoPreview'),
  })

  await expect(getViewletModuleIdForEditorInput({ type: 'image', uri: '/image.png' })).resolves.toBe('ImagePreview')
  await expect(getViewletModuleIdForEditorInput({ type: 'video', uri: '/video.mp4' })).resolves.toBe('VideoPreview')
  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', '/image.png'],
    ['Layout.getModuleId', '/video.mp4'],
  ])
})

test('getViewletModuleIdForEditorInput resolves the running extensions module', async () => {
  await expect(getViewletModuleIdForEditorInput({ type: 'running-extensions' })).resolves.toBe(ViewletModuleId.RunningExtensions)
})

test('getViewletModuleIdForEditorInput does not resolve a module for binary files', async () => {
  await expect(getViewletModuleIdForEditorInput({ type: 'binary', uri: 'file:///archive.zip' })).resolves.toBeUndefined()
})
