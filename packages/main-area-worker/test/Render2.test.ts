import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ApplyRender from '../src/parts/ApplyRender/ApplyRender.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { ensureActiveGroup } from '../src/parts/EnsureActiveGroup/EnsureActiveGroup.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('render2 returns renderer commands when no direct renderer is connected', () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState = ensureActiveGroup({ ...oldState, uid }, 'file:///test.txt')
  const expectedCommands = ApplyRender.applyRender(oldState, newState, Diff.diff(oldState, newState))
  MainAreaStates.set(uid, oldState, newState)

  expect(Render2.render2(uid, [DiffType.RenderItems])).toEqual(expectedCommands)
})

test('render2 includes state changes made after the caller computed its diff', () => {
  const uid = 4
  const oldState = { ...createDefaultState(), uid }
  MainAreaStates.set(uid, oldState, oldState)
  const staleDiff = diff2(uid)
  const newState = ensureActiveGroup(oldState, 'file:///third.txt')
  MainAreaStates.set(uid, oldState, newState)
  const expected = ApplyRender.applyRender(oldState, newState, Diff.diff(oldState, newState))

  expect(Render2.render2(uid, staleDiff)).toEqual(expected)
})

test('render2 does not repeat a pending viewlet update that was already consumed', () => {
  const uid = 5
  const oldState = { ...createDefaultState(), uid }
  MainAreaStates.set(uid, oldState, { ...oldState, pendingViewletUpdate: { disposal: 42 } })
  const staleDiff = diff2(uid)
  MainAreaStates.set(uid, oldState, oldState)

  expect(Render2.render2(uid, staleDiff)).toEqual([renderCss(oldState, oldState)])
})

test('render2 queues renderer commands and returns a lightweight commit marker', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
  const uid = 2
  const oldState = createDefaultState()
  const newState = ensureActiveGroup({ ...oldState, uid }, 'file:///test.txt')
  const expectedCommands = ApplyRender.applyRender(oldState, newState, Diff.diff(oldState, newState))
  MainAreaStates.set(uid, oldState, newState)

  const result = await Render2.render2(uid, [DiffType.RenderItems])

  expect(queueCommands).toHaveBeenCalledWith(uid, expectedCommands)
  expect(result).toEqual([['Viewlet.commitPending', uid, 17]])
})

test('render2 returns focus commands to the renderer worker when rendering directly', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => undefined,
  })
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
  const uid = 3
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    pendingViewletUpdate: {
      disposal: 4,
      focus: 5,
    },
    uid,
  }
  MainAreaStates.set(uid, oldState, newState)

  const result = await Render2.render2(uid, [DiffType.RenderPendingViewletUpdate])

  expect(queueCommands).toHaveBeenCalledWith(uid, [renderCss(oldState, newState)])
  expect(result).toEqual([
    ['Viewlet.setFocusContext', 5, 12, 0, 5, 'Editor'],
    ['Viewlet.commitPending', uid, 17],
  ])
  await new Promise((resolve) => setTimeout(resolve, 60))
  expect(mockRpc.invocations).toEqual([['Viewlet.dispose', 4]])
})
