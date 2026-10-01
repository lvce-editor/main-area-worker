import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as SaveEditor from '../src/parts/SaveEditor/SaveEditor.ts'

test('saveEditor should call Editor.save on RendererWorker', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.save': async () => ({ modified: false }),
  })

  const result = await SaveEditor.saveEditor(42)

  expect(result).toEqual({ modified: false })
  expect(mockRpc.invocations).toEqual([['Viewlet.save', 42]])
})

test('falls back only when an older renderer has no Viewlet.save command', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.save': async () => ({ modified: false }),
    'Viewlet.save': async () => {
      throw new Error('Command "Viewlet.save" not found (renderer worker)')
    },
  })
  await expect(SaveEditor.saveEditor(42, true)).resolves.toEqual({ modified: false })
  await expect(SaveEditor.saveEditor(43)).resolves.toEqual({ modified: false })
  expect(mockRpc.invocations).toEqual([
    ['Viewlet.save', 42, true],
    ['Editor.save', 42, true],
    ['Editor.save', 43],
  ])
})

test('does not fall back or clear dirty state when a document save fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.save': async () => {
      throw new Error('disk full')
    },
  })
  await expect(SaveEditor.saveEditor(42)).rejects.toThrow('disk full')
  expect(mockRpc.invocations).toEqual([['Viewlet.save', 42]])
})
