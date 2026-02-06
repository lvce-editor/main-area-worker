import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickTogglePreview } from '../src/parts/HandleClickTogglePreview/HandleClickTogglePreview.ts'

test('handleClickTogglePreview should return state unchanged', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPreview': async () => {},
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'test.html',
              uri: '/path/to/test.html',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTogglePreview(state)

  expect(result).toBe(state)
})

test('handleClickTogglePreview should work with empty state', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPreview': async () => {},
  })

  const state: MainAreaState = createDefaultState()

  const result = await handleClickTogglePreview(state)

  expect(result).toBe(state)
})
