import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorGroup } from '../src/parts/EditorGroup/EditorGroup.ts'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'
import { splitEditorGroupAndResize } from '../src/parts/SplitEditorGroupAndResize/SplitEditorGroupAndResize.ts'
import { splitLeft } from '../src/parts/SplitLeft/SplitLeft.ts'

test('splitEditorGroupAndResize skips resizing when splitting does not change the state', async () => {
  const state = createDefaultState()

  const newState = await splitEditorGroupAndResize(state, (currentState) => currentState)

  expect(newState).toBe(state)
})

test('splitEditorGroupAndResize updates existing editor bounds after splitting to the left', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    height: 600,
    layout: {
      activeGroupId: 1,
      direction: LayoutDirection.Horizontal,
      groups: [
        {
          activeTabId: 1,
          direction: LayoutDirection.Horizontal,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorUid: 10,
              icon: 'file',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'file.txt',
            },
          ],
        } satisfies EditorGroup,
      ],
    },
    tabHeight: 40,
    width: 800,
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.resize': async () => [['editor.resize']],
    'Viewlet.sendMultiple': async () => undefined,
  })

  const newState = await splitEditorGroupAndResize(state, splitLeft)

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.resize', 10, { height: 560, width: 400, x: 400, y: 40 }],
    ['Viewlet.sendMultiple', [['editor.resize']]],
  ])
  expect(newState.layout.groups[1].id).toBe(1)
})
