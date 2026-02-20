import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getCss } from '../src/parts/GetCss/GetCss.ts'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss should return set css command', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    uid: 7,
  }

  const result = renderCss(oldState, newState)

  expect(result).toEqual([ViewletCommand.SetCss, 7, getCss()])
})

test('renderCss should use new state uid', () => {
  const oldState = {
    ...createDefaultState(),
    uid: 1,
  }
  const newState = {
    ...createDefaultState(),
    uid: 42,
  }

  const result = renderCss(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetCss)
  expect(result[1]).toBe(42)
})
