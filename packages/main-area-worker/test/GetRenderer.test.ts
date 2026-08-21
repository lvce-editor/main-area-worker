import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as GetRenderer from '../src/parts/GetRenderer/GetRenderer.ts'
import { renderActiveTabVisibility } from '../src/parts/RenderActiveTabVisibility/RenderActiveTabVisibility.ts'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'
import { renderPendingViewletUpdate } from '../src/parts/RenderPendingViewletUpdate/RenderPendingViewletUpdate.ts'

test('getRenderer should return RenderItems.renderItems for RenderItems diff type', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderItems)
  expect(renderer).toBe(RenderItems.renderItems)
})

test('getRenderer should throw error for unknown diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(999)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for negative diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(-1)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for zero diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(0)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for other known diff types not implemented', () => {
  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderEditingIndex)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderFocus)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderFocusContext)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderValue)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderSelection)
  }).toThrow('unknown renderer')
})

test('getRenderer should return a function that can be called with state', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderItems)
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = createDefaultState()

  expect(typeof renderer).toBe('function')
  expect(() => {
    renderer(oldState, newState)
  }).not.toThrow()
})

test('getRenderer should return the css renderer', () => {
  expect(GetRenderer.getRenderer(DiffType.RenderCss)).toBe(renderCss)
})

test('getRenderer should return the incremental renderer', () => {
  expect(GetRenderer.getRenderer(DiffType.RenderIncremental)).toBe(renderIncremental)
})

test('getRenderer should return the active tab visibility renderer', () => {
  expect(GetRenderer.getRenderer(DiffType.RenderActiveTabVisibility)).toBe(renderActiveTabVisibility)
})

test('getRenderer should return the pending viewlet update renderer', () => {
  expect(GetRenderer.getRenderer(DiffType.RenderPendingViewletUpdate)).toBe(renderPendingViewletUpdate)
})
