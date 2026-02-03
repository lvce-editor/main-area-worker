import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { copyPath } from '../src/parts/CopyPath/CopyPath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('copyPath should copy the file path to clipboard', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const path = '/home/user/project/test.ts'
  const result = await copyPath(state, path)

  expect(result).toBe(state)
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0]).toEqual(['ClipBoard.writeText', path])
})

test('copyPath should handle absolute paths', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = '/absolute/path/to/file.js'

  await copyPath(state, path)

  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0][1]).toBe(path)
})

test('copyPath should handle Windows paths', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = 'C:\\Users\\test\\file.txt'

  await copyPath(state, path)

  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0][1]).toBe(path)
})

test('copyPath should handle file URIs', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = 'file:///home/user/document.md'

  await copyPath(state, path)

  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0][1]).toBe(path)
})

test('copyPath should return the same state', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
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
          tabs: [],
        },
      ],
    },
    uid: 123,
  }

  const path = '/path/to/file.ts'
  const result = await copyPath(state, path)

  expect(result).toBe(state)
  expect(result.uid).toBe(123)
  expect(result.layout.activeGroupId).toBe(1)
})

test('copyPath should handle empty string path', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = ''

  await copyPath(state, path)

  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0][1]).toBe('')
})
