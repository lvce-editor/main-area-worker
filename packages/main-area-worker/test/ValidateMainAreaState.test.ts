import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { validateMainAreaState } from '../src/parts/ValidateMainAreaState/ValidateMainAreaState.ts'

test('validateMainAreaState should return true for valid state', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
  }
  expect(validateMainAreaState(state)).toBe(true)
})

test('validateMainAreaState should return true for state with activeGroupId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  expect(validateMainAreaState(state)).toBe(true)
})

test('validateMainAreaState should return true for state with undefined activeGroupId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }
  expect(validateMainAreaState(state)).toBe(true)
})

test('validateMainAreaState should return false for null', () => {
  expect(validateMainAreaState(null)).toBeFalsy()
})

test('validateMainAreaState should return false for undefined', () => {
  expect(validateMainAreaState(undefined)).toBeFalsy()
})

test('validateMainAreaState should return false for missing assetDir', () => {
  const state = {
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid assetDir type', () => {
  const state = {
    assetDir: 123,
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for missing platform', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid platform type', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: '0',
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for missing layout', () => {
  const state = {
    assetDir: '',
    platform: 0,
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBeFalsy()
})

test('validateMainAreaState should return false for missing groups', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
    },
    platform: 0,
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid groups type', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: 'not an array',
    },
    platform: 0,
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for groups with invalid group', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: '1',,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
    platform: 0,
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid activeGroupId type', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: '1',
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid direction', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'diagonal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for missing uid', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
  }
  expect(validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid uid type', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: '0',
  }
  expect(validateMainAreaState(state)).toBe(false)
})
