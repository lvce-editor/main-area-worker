import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import * as ApplyRender from '../src/parts/ApplyRender/ApplyRender.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('render2 returns renderer commands when no direct renderer is connected', () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState = { ...oldState, uid }
  const expectedCommands = ApplyRender.applyRender(oldState, newState, [DiffType.RenderItems])
  MainAreaStates.set(uid, oldState, newState)

  expect(Render2.render2(uid, [DiffType.RenderItems])).toEqual(expectedCommands)
})

test('render2 queues renderer commands and returns a lightweight commit marker', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
  const uid = 2
  const oldState = createDefaultState()
  const newState = { ...oldState, uid }
  const expectedCommands = ApplyRender.applyRender(oldState, newState, [DiffType.RenderItems])
  MainAreaStates.set(uid, oldState, newState)

  const result = await Render2.render2(uid, [DiffType.RenderItems])

  expect(queueCommands).toHaveBeenCalledWith(uid, expectedCommands)
  expect(result).toEqual([['Viewlet.commitPending', uid, 17]])
})
