import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { executeViewletCommands } from '../src/parts/ExecuteViewletCommands/ExecuteViewletCommands.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'

afterEach(() => {
  MainAreaStates.clear()
})

test('executeViewletCommands handles attach, detach, dispose, and bounds commands in order', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.attachViewlet': async () => {},
    'Viewlet.detach': async () => {},
    'Viewlet.dispose': async () => {},
    'Viewlet.setBounds': async () => {},
  })
  const bounds = { height: 40, width: 50, x: 10, y: 20 }

  await executeViewletCommands([
    { instanceId: 1, type: 'attach' },
    { instanceId: 2, type: 'detach' },
    { instanceId: 3, type: 'dispose' },
    { bounds, instanceId: 4, type: 'setBounds' },
  ])

  expect(mockRpc.invocations).toEqual([
    ['Layout.attachViewlet', '.editor-groups-container, .EditorGroup', 1],
    ['Viewlet.detach', 2],
    ['Viewlet.dispose', 3],
    ['Viewlet.setBounds', 4, bounds],
  ])
})

test('executeViewletCommands creates a viewlet and marks its tab ready', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Viewlet.getTitle': async () => 'Rendered title',
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
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 7,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              loadingState: 'loading',
              title: 'Loading',
              uri: '/test.ts',
            },
          ],
        },
      ],
    },
  }
  MainAreaStates.set(0, state, state)
  const bounds = { height: 40, width: 50, x: 10, y: 20 }

  await executeViewletCommands([{ bounds, editorUid: 7, tabId: 1, type: 'create', uid: 0, uri: undefined, viewletModuleId: 'Editor' }])

  expect(mockRpc.invocations).toEqual([
    ['Layout.createViewlet', 'Editor', 7, 1, bounds, ''],
    ['Viewlet.getTitle', 7],
  ])
  expect(MainAreaStates.get(0).newState.layout.groups[0].tabs[0]).toMatchObject({
    loadingState: 'loaded',
    title: 'Rendered title',
  })
})
