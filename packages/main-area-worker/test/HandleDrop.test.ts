import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDrop } from '../src/parts/HandleDrop/HandleDrop.ts'

test('clears the drag overlay when no uri is dropped', async () => {
  let state: MainAreaState = {
    ...createDefaultState(),
    dragOverlay: {
      height: 300,
      width: 500,
      x: 0,
      y: 0,
    },
  }
  const context: AsyncCommandContext<MainAreaState> = {
    getState() {
      return state
    },
    async updateState(updater) {
      state = updater(state)
      return state
    },
  }

  await handleDrop(context, [])

  expect(state.dragOverlay).toBeUndefined()
})

test('opens a dropped explorer uri', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'string',
          type: 'text/uri-list',
          value: 'file:///workspace/file.txt',
        },
      ] as any
    },
  })
  let state: MainAreaState = {
    ...createDefaultState(),
    dragOverlay: {
      height: 300,
      width: 500,
      x: 0,
      y: 0,
    },
    layout: {
      activeGroupId: undefined,
      direction: 1,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorInput: {
                type: 'editor',
                uri: 'file:///workspace/file.txt',
              },
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
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
  const context: AsyncCommandContext<MainAreaState> = {
    getState() {
      return state
    },
    async updateState(updater) {
      state = updater(state)
      return state
    },
  }

  await handleDrop(context, [1])

  expect(state.dragOverlay).toBeUndefined()
  expect(state.layout.activeGroupId).toBe(1)
  expect(state.layout.groups[0].activeTabId).toBe(2)
  expect(state.layout.groups[0].focused).toBe(true)
})
