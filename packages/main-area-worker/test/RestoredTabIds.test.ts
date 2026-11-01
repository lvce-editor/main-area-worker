import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Id from '../src/parts/Id/Id.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import { openInput } from '../src/parts/OpenInput/OpenInput.ts'

test('opening Workers after restoring a session preserves the file tab identity and title', async () => {
  const titles = new Map<number, string>()
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async (moduleId: string, uid: number) => {
      titles.set(uid, moduleId === 'Workers' ? 'Workers' : 'original.ts')
    },
    'Layout.getModuleId': async (uri: string) => (uri.startsWith('workers:') ? 'Workers' : 'Editor'),
    'Viewlet.getTitle': async (uid: number) => titles.get(uid),
  })
  // A new renderer reserves the same first range as the saved session.
  Id.configure(100, 1000)
  const restored = await loadContent(createDefaultState(), {
    layout: {
      activeGroupId: 100,
      direction: 1,
      groups: [
        {
          activeTabId: 101,
          direction: 1,
          id: 100,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [{ editorUid: 102, icon: '', id: 101, isDirty: false, isPreview: false, title: 'original.ts', uri: 'file:///original.ts' }],
        },
      ],
    },
  })
  const result = await openInput(restored, {
    editorInput: { type: 'editor', uri: 'workers:///1' },
    focus: false,
  })
  expect(rpc.invocations.filter(([command]) => command === 'Layout.createViewlet')).toHaveLength(2)
  const group = result.layout.groups[0]
  expect(group.tabs.map((tab) => tab.title)).toEqual(['original.ts', 'Workers'])
  expect(new Set(group.tabs.map((tab) => tab.id)).size).toBe(2)
  expect(group.tabs.filter((tab) => tab.id === group.activeTabId)).toHaveLength(1)
  expect(new Set(group.tabs.map((tab) => tab.editorUid)).size).toBe(2)
})
