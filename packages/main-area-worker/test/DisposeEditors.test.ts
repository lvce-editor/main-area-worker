import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { disposeEditors } from '../src/parts/DisposeEditors/DisposeEditors.ts'

test('disposeEditors should call Viewlet.dispose for each editor uid', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })

  await disposeEditors([1, 2, 3])

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 2],
    ['Viewlet.dispose', 3],
  ])
})

test('disposeEditors should handle empty array', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })

  await disposeEditors([])

  expect(mockRpc.invocations).toEqual([])
})

test('disposeEditors should handle single editor uid', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })

  await disposeEditors([42])

  expect(mockRpc.invocations).toEqual([['Viewlet.dispose', 42]])
})

test('disposeEditors should handle many editor uids', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })

  const editorUids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  await disposeEditors(editorUids)

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 2],
    ['Viewlet.dispose', 3],
    ['Viewlet.dispose', 4],
    ['Viewlet.dispose', 5],
    ['Viewlet.dispose', 6],
    ['Viewlet.dispose', 7],
    ['Viewlet.dispose', 8],
    ['Viewlet.dispose', 9],
    ['Viewlet.dispose', 10],
  ])
})

test('disposeEditors should silently ignore errors during disposal', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async (editorUid: number) => {
      if (editorUid === 2) {
        throw new Error('Disposal failed')
      }
    },
  })

  // Should not throw even though editor uid 2 fails
  await expect(disposeEditors([1, 2, 3])).resolves.toBeUndefined()

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 2],
    ['Viewlet.dispose', 3],
  ])
})

test('disposeEditors should continue disposing remaining editors after error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async (editorUid: number) => {
      if (editorUid === 1) {
        throw new Error('First disposal failed')
      }
    },
  })

  await disposeEditors([1, 2, 3])

  // All three should be attempted despite first one failing
  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 2],
    ['Viewlet.dispose', 3],
  ])
})

test('disposeEditors should handle all editors failing', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {
      throw new Error('All disposals fail')
    },
  })

  await expect(disposeEditors([1, 2, 3])).resolves.toBeUndefined()

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 2],
    ['Viewlet.dispose', 3],
  ])
})

test('disposeEditors should handle negative editor uids', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })

  await disposeEditors([-1, -2, -3])

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', -1],
    ['Viewlet.dispose', -2],
    ['Viewlet.dispose', -3],
  ])
})

test('disposeEditors should handle zero as editor uid', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })

  await disposeEditors([0])

  expect(mockRpc.invocations).toEqual([['Viewlet.dispose', 0]])
})

test('disposeEditors should handle duplicate editor uids', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })

  await disposeEditors([1, 1, 2, 2, 3])

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 2],
    ['Viewlet.dispose', 2],
    ['Viewlet.dispose', 3],
  ])
})

test('disposeEditors should be awaitable', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })

  const result = await disposeEditors([1, 2])

  expect(result).toBeUndefined()
  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 2],
  ])
})

test('disposeEditors should handle different types of errors', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async (editorUid: number) => {
      if (editorUid === 1) {
        throw new Error('Standard error')
      }
      if (editorUid === 2) {
        throw new TypeError('Type error')
      }
      if (editorUid === 3) {
        throw 'String error'
      }
    },
  })

  await expect(disposeEditors([1, 2, 3, 4])).resolves.toBeUndefined()

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 1],
    ['Viewlet.dispose', 2],
    ['Viewlet.dispose', 3],
    ['Viewlet.dispose', 4],
  ])
})
