import { expect, test } from '@jest/globals'
import { ClipBoardWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { copyRelativePath } from '../src/parts/CopyRelativePath/CopyRelativePath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('copyRelativePath should copy the relative path to clipboard', async () => {
  // @ts-ignore
  using clipboardRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })
  using rendererRpc = RendererWorker.registerMockRpc({
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
  expect(rendererRpc.invocations).toEqual([['Workspace.pathBaseName', path]])
  expect(clipboardRpc.invocations).toEqual([['ClipBoard.writeText', 'src/test.ts']])
})

test('copyRelativePath should handle nested paths', async () => {
  // @ts-ignore
  using clipboardRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Workspace.pathBaseName': async (path: string) => {
      return 'src/components/Button/Button.tsx'
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = '/home/user/project/src/components/Button/Button.tsx'

  await copyRelativePath(state, path)

  expect(rendererRpc.invocations).toEqual([['Workspace.pathBaseName', path]])
  expect(clipboardRpc.invocations).toEqual([['ClipBoard.writeText', 'src/components/Button/Button.tsx']])
})

test('copyRelativePath should handle root level files', async () => {
  // @ts-ignore
  using clipboardRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Workspace.pathBaseName': async (path: string) => {
      return 'README.md'
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = '/home/user/project/README.md'

  await copyRelativePath(state, path)

  expect(rendererRpc.invocations).toEqual([['Workspace.pathBaseName', path]])
  expect(clipboardRpc.invocations).toEqual([['ClipBoard.writeText', 'README.md']])
})

test('copyRelativePath should return the same state', async () => {
  // @ts-ignore
  using clipboardRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Workspace.pathBaseName': async (path: string) => {
      return 'file.ts'
    },
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 2,
      groups: [
        {
          activeTabId: 5,
          direction: 2,
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
  expect(rendererRpc.invocations).toEqual([['Workspace.pathBaseName', path]])
  expect(clipboardRpc.invocations).toEqual([['ClipBoard.writeText', 'file.ts']])
})

test('copyRelativePath should handle file URIs', async () => {
  // @ts-ignore
  using clipboardRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Workspace.pathBaseName': async (path: string) => {
      return 'docs/guide.md'
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = 'file:///home/user/workspace/docs/guide.md'

  await copyRelativePath(state, path)

  expect(rendererRpc.invocations).toEqual([['Workspace.pathBaseName', path]])
  expect(clipboardRpc.invocations).toEqual([['ClipBoard.writeText', 'docs/guide.md']])
})

test('copyRelativePath should handle Windows paths', async () => {
  // @ts-ignore
  using clipboardRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.writeText': async (text: string) => {
      return undefined
    },
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Workspace.pathBaseName': async (path: string) => {
      return 'src\\main.ts'
    },
  })

  const state: MainAreaState = createDefaultState()
  const path = 'C:\\Users\\test\\workspace\\src\\main.ts'

  await copyRelativePath(state, path)

  expect(rendererRpc.invocations).toEqual([['Workspace.pathBaseName', path]])
  expect(clipboardRpc.invocations).toEqual([['ClipBoard.writeText', 'src\\main.ts']])
})
