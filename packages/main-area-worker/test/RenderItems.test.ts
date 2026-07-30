import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderItems } from '../src/parts/RenderItems/RenderItems.ts'

test('renderItems clears the dom for the initial state', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    initial: true,
    uid: 7,
  }

  expect(renderItems(oldState, newState)).toEqual([ViewletCommand.SetDom2, 7, []])
})
