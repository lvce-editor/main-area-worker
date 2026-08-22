import { expect, test } from '@jest/globals'
import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeAll } from '../src/parts/CloseAll/CloseAll.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeAll should close all tabs and groups', async () => {
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
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              isPreview: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = await closeAll(state)

  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBe(-1)
  expect(result).not.toBe(state)
})

test('closeAll should preserve layout direction', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 2,
      groups: [
        {
          activeTabId: 1,
          direction: 2,
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
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await closeAll(state)

  expect(result.layout.direction).toBe(2)
  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBe(-1)
})

test('closeAll should preserve other state properties', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/assets',
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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
    platform: 1,
    uid: 123,
  }

  const result = await closeAll(state)

  expect(result.assetDir).toBe('/test/assets')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(123)
})

test('closeAll should handle empty state', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: -1,
      direction: 1,
      groups: [],
    },
  }

  const result = await closeAll(state)

  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBe(-1)
})

test('closeAll should handle multiple groups with many tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 33,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: true,
              isPreview: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          direction: 1,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 33,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              isPreview: false,
              title: 'File 3',
            },
          ],
        },
        {
          activeTabId: 4,
          direction: 1,
          focused: false,
          id: 3,
          isEmpty: false,
          size: 34,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: true,
              isPreview: false,
              title: 'File 4',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              isPreview: false,
              title: 'File 5',
            },
          ],
        },
      ],
    },
  }

  const result = await closeAll(state)

  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBe(-1)
})

test('closeAll should dispose editor viewlets', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
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
              editorUid: 101,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: 102,
              icon: '',
              id: 3,
              isDirty: false,
              isPreview: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  await closeAll(state)

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.dispose', 101],
    ['Viewlet.dispose', 102],
  ])
})

test('closeAll should keep a dirty editor open when closing is canceled', async () => {
  using rendererRpc = RendererWorker.registerMockRpc({})
  using dialogRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt': async () => false,
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
              editorUid: 101,
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              title: 'dirty.txt',
              uri: 'file:///dirty.txt',
            },
          ],
        },
      ],
    },
  }

  const result = await closeAll(state)

  expect(result).toBe(state)
  expect(rendererRpc.invocations).toEqual([
    [
      'ConfirmPrompt.prompt',
      'Do you want to save the changes you made to dirty.txt?',
      { cancelMessage: 'More Options', confirmMessage: 'Save', title: 'Save Changes' },
    ],
    [
      'ConfirmPrompt.prompt',
      'Discard the changes you made to dirty.txt?',
      { cancelMessage: 'Cancel', confirmMessage: "Don't Save", title: 'Save Changes' },
    ],
  ])
  expect(dialogRpc.invocations).toEqual(rendererRpc.invocations)
})
