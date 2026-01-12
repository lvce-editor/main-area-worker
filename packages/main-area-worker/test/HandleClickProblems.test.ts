import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickProblems from '../src/parts/HandleClickProblems/HandleClickProblems.ts'

test.skip('handleClickProblems should call Layout.showPanel', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.selectIndex': async () => {},
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations).toEqual([['Layout.showPanel'], ['Panel.selectIndex', 1]])
})

test.skip('handleClickProblems should call Panel.selectIndex with 1', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.selectIndex': async () => {},
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations).toEqual([['Layout.showPanel'], ['Panel.selectIndex', 1]])
})

test.skip('handleClickProblems should call Layout.showPanel and Panel.selectIndex in order', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.selectIndex': async () => {},
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations).toEqual([['Layout.showPanel'], ['Panel.selectIndex', 1]])
})
