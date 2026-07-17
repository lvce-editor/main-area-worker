import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffPendingViewletDisposal/DiffPendingViewletDisposal.ts'
import { isEqual as isFocusEqual } from '../src/parts/DiffPendingViewletFocus/DiffPendingViewletFocus.ts'
import { renderPendingViewletDisposal } from '../src/parts/RenderPendingViewletDisposal/RenderPendingViewletDisposal.ts'
import { renderPendingViewletFocus } from '../src/parts/RenderPendingViewletFocus/RenderPendingViewletFocus.ts'

test('pending viewlet disposal is scheduled after the main area update and is cleared', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => undefined,
  })
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    pendingViewletDisposal: 123,
  }

  expect(isEqual(oldState, newState)).toBe(false)
  expect(renderPendingViewletDisposal(oldState, newState)).toEqual([])
  expect(newState.pendingViewletDisposal).toBeUndefined()
  expect(isEqual(oldState, newState)).toBe(true)

  await new Promise((resolve) => setTimeout(resolve, 60))

  expect(mockRpc.invocations).toEqual([['Viewlet.dispose', 123]])
})

test('pending viewlet focus renders after disposal and is cleared', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    pendingViewletFocus: 122,
  }

  expect(isFocusEqual(oldState, newState)).toBe(false)
  expect(renderPendingViewletFocus(oldState, newState)).toEqual(['Viewlet.setFocusContext', 122, 12, 0, 122, 'Editor'])
  expect(newState.pendingViewletFocus).toBeUndefined()
  expect(isFocusEqual(oldState, newState)).toBe(true)
})
