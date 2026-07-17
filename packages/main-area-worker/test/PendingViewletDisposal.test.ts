import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { modules } from '../src/parts/DiffModules/DiffModules.ts'
import { renderPendingViewletUpdate } from '../src/parts/RenderPendingViewletUpdate/RenderPendingViewletUpdate.ts'

test('pending viewlet update focuses the replacement, schedules disposal, and is cleared', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => undefined,
  })
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    pendingViewletUpdate: {
      disposal: 123,
      focus: 122,
    },
  }

  expect(modules[2](oldState, newState)).toBe(false)
  expect(renderPendingViewletUpdate(oldState, newState)).toEqual(['Viewlet.setFocusContext', 122, 12, 0, 122, 'Editor'])
  expect(newState.pendingViewletUpdate).toBeUndefined()
  expect(modules[2](oldState, newState)).toBe(true)

  await new Promise((resolve) => setTimeout(resolve, 60))

  expect(mockRpc.invocations).toEqual([['Viewlet.dispose', 123]])
})

test('pending viewlet update without replacement only schedules disposal', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => undefined,
  })
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    pendingViewletUpdate: {
      disposal: 123,
    },
  }

  expect(renderPendingViewletUpdate(oldState, newState)).toEqual([])
  expect(newState.pendingViewletUpdate).toBeUndefined()

  await new Promise((resolve) => setTimeout(resolve, 60))

  expect(mockRpc.invocations).toEqual([['Viewlet.dispose', 123]])
})
