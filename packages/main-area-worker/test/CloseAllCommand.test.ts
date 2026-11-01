import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeAll } from '../src/parts/CloseAll/CloseAll.ts'
import { closeAllCommand } from '../src/parts/CloseAllCommand/CloseAllCommand.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeAllCommand renders the empty layout before concurrently disposing editors', async () => {
  const dispose = Promise.withResolvers<void>()
  const invocations: (string | number)[] = []
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': async () => {
      invocations.push('render')
    },
    'Viewlet.dispose': async (editorUid: number) => {
      invocations.push(editorUid)
      await dispose.promise
    },
  })
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            { editorUid: 101, icon: '', id: 1, isDirty: false, isPreview: false, title: 'File 1' },
            { editorUid: 102, icon: '', id: 2, isDirty: false, isPreview: false, title: 'File 2' },
          ],
        },
      ],
    },
  }
  let completed = false

  const resultPromise = (async () => {
    const result = await closeAllCommand(closeAll, state)
    completed = true
    return result
  })()
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(invocations).toEqual(['render', 101, 102])
  expect(completed).toBe(false)
  dispose.resolve()
  const result = await resultPromise

  expect(result.layout.groups).toEqual([])
  expect(completed).toBe(true)
  expect(mockRpc.invocations).toHaveLength(3)
})
