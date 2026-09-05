import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { notifyMountedViewlets } from '../src/parts/NotifyMountedViewlets/NotifyMountedViewlets.ts'

const createState = (editorUid: number, loadingState: 'loaded' | 'loading' = 'loaded'): MainAreaState => ({
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
            editorUid,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            loadingState,
            title: 'file.txt',
            uri: 'file:///same.txt',
          },
        ],
      },
    ],
  },
})

test('publishes visible UIDs even when the active URI is unchanged', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.setMountedViewlets': () => undefined,
  })
  await notifyMountedViewlets(createState(101), createState(102))
  expect(mockRpc.invocations).toEqual([['Layout.setMountedViewlets', createDefaultState().uid, [102]]])
})

test('publishes initial restoration and loading transitions', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.setMountedViewlets': () => undefined,
  })
  await notifyMountedViewlets(createState(101, 'loading'), createState(101, 'loaded'))
  expect(mockRpc.invocations).toEqual([['Layout.setMountedViewlets', createDefaultState().uid, [101]]])
})

test('does not publish an unchanged mounted set', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.setMountedViewlets': () => undefined,
  })
  await notifyMountedViewlets(createState(101), createState(101))
  expect(mockRpc.invocations).toEqual([])
})

test('does not fail the editor command when Layout cannot receive the publication', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  using _mockRpc = RendererWorker.registerMockRpc({
    'Layout.setMountedViewlets': () => {
      throw new Error('command unavailable')
    },
  })
  await expect(notifyMountedViewlets(createState(101), createState(102))).resolves.toBeUndefined()
  expect(warn).toHaveBeenCalledTimes(1)
  warn.mockRestore()
})
