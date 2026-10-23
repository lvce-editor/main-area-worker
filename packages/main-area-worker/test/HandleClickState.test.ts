import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'

afterEach(() => {
  MainAreaStates.clear()
})

test.each(['MainArea.handleClick', 'MainArea.handleGroupMouseDown'] as const)(
  '%s retains dirty-status updates received during active-editor notification',
  async (command) => {
    const uid = 1
    const uri = 'file:///right.txt'
    const state: MainAreaState = {
      ...createDefaultState(),
      layout: {
        activeGroupId: 2,
        direction: 1,
        groups: [
          { activeTabId: -1, direction: 1, id: 1, isEmpty: true, isFocused: false, size: 50, tabs: [] },
          {
            activeTabId: 2,
            direction: 1,
            id: 2,
            isEmpty: false,
            isFocused: true,
            size: 50,
            tabs: [{ editorUid: 2, icon: '', id: 2, isDirty: false, isPreview: false, title: 'right.txt', uri }],
          },
        ],
      },
      uid,
    }
    MainAreaStates.set(uid, state, state)
    const notifying = Promise.withResolvers<void>()
    const resume = Promise.withResolvers<void>()
    using mockRpc = RendererWorker.registerMockRpc({
      'Layout.handleActiveEditorChange': async () => {
        notifying.resolve()
        await resume.promise
      },
    })

    const activation = commandMap[command](uid, '1')
    await notifying.promise
    await commandMap['MainArea.handleModifiedStatusChange'](uid, uri, true)
    resume.resolve()
    await activation

    const result = MainAreaStates.get(uid).newState
    expect(result.layout.activeGroupId).toBe(1)
    expect(result.layout.groups[1].tabs[0].isDirty).toBe(true)
    expect(mockRpc.invocations).toHaveLength(1)
  },
)
