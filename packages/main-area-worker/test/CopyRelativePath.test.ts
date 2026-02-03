import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { copyRelativePath } from '../src/parts/CopyRelativePath/CopyRelativePath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('copyRelativePath should copy the relative path to clipboard', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
    'Workspace.pathBaseName': async (path: string) => {
      return 'src/test.ts'
    },
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const path = '/home/user/project/src/test.ts'
  const result = await copyRelativePath(state, path)

  expect(result).toBe(state)
  expect(mockRpc.invocations.length).toBe(2)
  expect(mockRpc.invocations[0]).toEqual(['Workspace.pathBaseName', path])
  expect(mockRpc.invocations[1]).toEqual(['ClipBoard.writeText', 'src/test.ts'])
})

test('copyRelativePath should handle nested paths', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
    'Workspace.pathBaseName': async (path: string) => {
      return 'src/components/Button/Button.tsx'
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = '/home/user/project/src/components/Button/Button.tsx'

  await copyRelativePath(state, path)

  expect(mockRpc.invocations.length).toBe(2)
  expect(mockRpc.invocations[1][1]).toBe('src/components/Button/Button.tsx')
})

test('copyRelativePath should handle root level files', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
    'Workspace.pathBaseName': async (path: string) => {
      return 'README.md'
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = '/home/user/project/README.md'

  await copyRelativePath(state, path)

  expect(mockRpc.invocations.length).toBe(2)
  expect(mockRpc.invocations[1][1]).toBe('README.md')
})

test('copyRelativePath should return the same state', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
    'Workspace.pathBaseName': async (path: string) => {
      return 'file.ts'
    },
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 5,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 200,
          tabs: [],
        },
      ],
    },
    uid: 456,
  }

  const path = '/path/to/file.ts'
  const result = await copyRelativePath(state, path)

  expect(result).toBe(state)
  expect(result.uid).toBe(456)
  expect(result.layout.activeGroupId).toBe(2)
})

test('copyRelativePath should handle file URIs', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
    'Workspace.pathBaseName': async (path: string) => {
      return 'docs/guide.md'
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = 'file:///home/user/workspace/docs/guide.md'

  await copyRelativePath(state, path)

  expect(mockRpc.invocations.length).toBe(2)
  expect(mockRpc.invocations[0][1]).toBe(path)
  expect(mockRpc.invocations[1][1]).toBe('docs/guide.md')
})

test('copyRelativePath should handle Windows paths', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
    'Workspace.pathBaseName': async (path: string) => {
      return 'src\\main.ts'
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = 'C:\\Users\\test\\workspace\\src\\main.ts'

  await copyRelativePath(state, path)

  expect(mockRpc.invocations.length).toBe(2)
  expect(mockRpc.invocations[1][1]).toBe('src\\main.ts')
})
