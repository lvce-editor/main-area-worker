import { expect, test } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { refreshFileIcons } from '../src/parts/RefreshFileIcons/RefreshFileIcons.ts'

const createState = (): MainAreaState => {
  return {
    ...createDefaultState(),
    uid: 1,
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              isPreview: false,
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
          ],
        },
      ],
    },
  }
}

test('refreshFileIcons should update stored states after icon theme worker is ready', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript'],
  })

  MainAreaStates.clear()
  const state = createState()
  MainAreaStates.set(state.uid, state, state)

  await refreshFileIcons()

  const { newState } = MainAreaStates.get(state.uid)
  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'script.ts', type: 1 }]]])
  expect(newState.layout.groups[0].tabs[0].icon).toBe('file-icon-typescript')
  expect(newState.fileIconCache).toEqual({
    '/path/to/script.ts': 'file-icon-typescript',
  })

  MainAreaStates.clear()
})