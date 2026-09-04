import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openInput } from '../src/parts/OpenInput/OpenInput.ts'
import { openLargeFile } from '../src/parts/OpenLargeFile/OpenLargeFile.ts'

test('opens a large file without persisting the size-check bypass', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': async () => 2 * 1024 * 1024,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
    'Preferences.get': async () => 1,
  })
  const state = await openInput(createDefaultState(), {
    editorInput: {
      type: 'editor',
      uri: 'file:///large.txt',
    },
    focus: false,
  })

  const result = await openLargeFile(state)

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    editorInput: {
      type: 'editor',
      uri: 'file:///large.txt',
    },
    loadingState: 'loaded',
  })
  expect(mockRpc.invocations.filter(([command]) => command === 'FileSystem.getFileSize')).toHaveLength(1)
})

test('returns the same state when there is no active tab', async () => {
  const state = createDefaultState()

  await expect(openLargeFile(state)).resolves.toBe(state)
})
