import { expect, test } from '@jest/globals'
import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as SaveEditor from '../src/parts/SaveEditor/SaveEditor.ts'

test('saveEditor should call Editor.save on RendererWorker', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.save': async () => ({ modified: false }),
  })

  const result = await SaveEditor.saveEditor(42)

  expect(result).toEqual({ modified: false })
  expect(mockRpc.invocations).toEqual([['Editor.save', 42]])
})