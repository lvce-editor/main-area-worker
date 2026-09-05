import { afterEach, expect, test } from '@jest/globals'
import { IconThemeWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'

afterEach(() => {
  MainAreaStates.clear()
})

test('resize during restore is applied to the restored editor', async () => {
  const homeDir = Promise.withResolvers<string>()
  using rendererRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
    'Layout.handleActiveEditorChange': async () => {},
    'Viewlet.resize': async () => [],
    'Workspace.getHomeDir': async () => homeDir.promise,
  })
  using _iconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => [''],
  })
  const savedState = {
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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'file.txt',
              uri: 'file:///workspace/file.txt',
            },
          ],
        },
      ],
    },
  }

  commandMap['MainArea.create'](1, '', 0, 0, 300, 100, 1, '/assets')
  const loading = commandMap['MainArea.loadContent'](1, savedState)
  await Promise.resolve()

  const resizing = commandMap['MainArea.resize'](1, { height: 600, width: 800, x: 10, y: 20 })
  homeDir.resolve('/home/test')
  await Promise.all([loading, resizing])

  expect(rendererRpc.invocations).toContainEqual(['Viewlet.resize', expect.any(Number), { height: 565, width: 800, x: 10, y: 55 }])
  expect(MainAreaStates.get(1).newState).toMatchObject({ height: 600, width: 800, x: 10, y: 20 })
})
