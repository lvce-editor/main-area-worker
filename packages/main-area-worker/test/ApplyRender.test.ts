import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as ApplyRender from '../src/parts/ApplyRender/ApplyRender.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('applyRender should return empty array when diffResult is empty', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = createDefaultState()

  const result = ApplyRender.applyRender(oldState, newState, [])

  expect(result).toEqual([])
})

test('applyRender should return commands when diffResult contains RenderItems', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const result = ApplyRender.applyRender(oldState, newState, [DiffType.RenderItems])

  expect(result).toHaveLength(1)
  expect(result[0][0]).toBe(ViewletCommand.SetDom2)
  expect(result[0][1]).toBe(1)
  expect(Array.isArray(result[0][2])).toBe(true)
})

test('applyRender should return multiple commands when diffResult contains multiple items', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = {
    ...createDefaultState(),
    uid: 2,
  }

  const result = ApplyRender.applyRender(oldState, newState, [DiffType.RenderItems, DiffType.RenderItems])

  expect(result).toHaveLength(2)
  expect(result[0][0]).toBe(ViewletCommand.SetDom2)
  expect(result[0][1]).toBe(2)
  expect(result[1][0]).toBe(ViewletCommand.SetDom2)
  expect(result[1][1]).toBe(2)
})

test('applyRender reveals the active tab after applying DOM and CSS changes', () => {
  const oldState = createDefaultState()
  const newState: MainAreaState = {
    ...oldState,
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorUid: 3,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'active.txt',
              uri: 'file:///active.txt',
            },
          ],
        },
      ],
    },
    uid: 9,
    width: 800,
  }

  const result = ApplyRender.applyRender(oldState, newState, [DiffType.RenderIncremental, DiffType.RenderCss, DiffType.RenderActiveTabVisibility])

  expect(result.map((command) => command[0])).toEqual([ViewletCommand.SetPatches, ViewletCommand.SetCss, 'Viewlet.scrollSelectorIntoView'])
})

test('applyRender should throw error when diffResult contains unknown diffType', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = createDefaultState()

  expect(() => {
    ApplyRender.applyRender(oldState, newState, [999])
  }).toThrow('unknown renderer')
})

test('applyRender should handle mixed valid and invalid diffTypes', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = {
    ...createDefaultState(),
    uid: 3,
  }

  expect(() => {
    ApplyRender.applyRender(oldState, newState, [DiffType.RenderItems, 999])
  }).toThrow('unknown renderer')
})

test('applyRender should omit renderers that produce no commands', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => {},
  })
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    pendingViewletUpdate: {
      disposal: 1,
    },
  }

  expect(ApplyRender.applyRender(oldState, newState, [DiffType.RenderPendingViewletUpdate])).toEqual([])
  await new Promise((resolve) => {
    setTimeout(resolve, 75)
  })
  expect(mockRpc.invocations).toEqual([['Viewlet.dispose', 1]])
})
