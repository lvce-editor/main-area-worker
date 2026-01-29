import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { restoreMainAreaState, restoreMainState } from '../src/parts/RestoreMainAreaState/RestoreMainAreaState.ts'

test('restoreMainAreaState should restore layout from valid saved state', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/current/path',
    platform: 1,
    uid: 100,
  }

  const savedLayout = {
    activeGroupId: 2,
    direction: 'vertical',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 2,
        size: 50,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'Restored File',
          },
        ],
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout).toEqual(savedLayout)
  expect(result.assetDir).toBe('/current/path')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(100)
})

test('restoreMainAreaState should preserve all current state properties except layout', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/preserved/path',
    disposed: true,
    platform: 5,
    uid: 999,
  }

  const savedLayout = {
    activeGroupId: 3,
    direction: 'horizontal',
    groups: [],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.assetDir).toBe('/preserved/path')
  expect(result.disposed).toBe(true)
  expect(result.platform).toBe(5)
  expect(result.uid).toBe(999)
  expect(result.layout).toEqual(savedLayout)
})

test('restoreMainAreaState should return current state for invalid JSON', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const invalidJson = '{ invalid json }'

  const result = restoreMainAreaState(invalidJson, currentState)

  expect(result).toBe(currentState)
  expect(result.layout).toEqual(currentState.layout)
})

test('restoreMainAreaState should return current state for empty string', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const result = restoreMainAreaState('', currentState)

  expect(result).toBe(currentState)
})

test('restoreMainAreaState should set layout to undefined when layout property is missing', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedState = JSON.stringify({
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result).not.toBe(currentState)
  expect((result as any).layout).toBeUndefined()
  expect(result.assetDir).toBe('/test/path')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(1)
})

test('restoreMainAreaState should handle complex layout with multiple groups', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 50,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File 1',
          },
        ],
      },
      {
        activeTabId: 2,
        focused: false,
        id: 2,
        size: 50,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: true,
            title: 'File 2',
          },
        ],
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout).toEqual(savedLayout)
  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[1].tabs).toHaveLength(1)
})

test('restoreMainAreaState should handle layout with custom editor tabs', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'vertical',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            customEditorId: 'custom-editor-1',
            editorType: 'custom',
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'Custom Editor',
          },
        ],
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout).toEqual(savedLayout)
  expect(result.layout.groups[0].tabs[0].editorType).toBe('custom')
  expect(result.layout.groups[0].tabs[0].customEditorId).toBe('custom-editor-1')
})

test('restoreMainAreaState should handle layout with tabs containing paths and languages', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            errorMessage: '',
            icon: '',
            id: 1,
            isDirty: false,
            language: 'javascript',
            loadingState: 'idle',
            title: 'script.ts',
            uri: '/path/to/script.ts',
          },
        ],
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout).toEqual(savedLayout)
  expect(result.layout.groups[0].tabs[0].uri).toBe('/path/to/script.ts')
  expect(result.layout.groups[0].tabs[0].language).toBe('javascript')
})

test('restoreMainAreaState should handle layout with undefined activeGroupId', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: undefined,
    direction: 'horizontal',
    groups: [],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.activeGroupId).toBeUndefined()
  expect(result.layout.groups).toHaveLength(0)
})

test('restoreMainAreaState should handle layout with empty groups', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        size: 100,
        tabs: [],
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
})

test('restoreMainAreaState should return new state object, not mutate current state', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result).not.toBe(currentState)
  expect(result.layout).not.toBe(currentState.layout)
})

test('restoreMainAreaState should handle different version strings', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '2.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout).toEqual(savedLayout)
})

test('restoreMainAreaState should return current state for null JSON', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const result = restoreMainAreaState('null', currentState)

  expect(result).toBe(currentState)
})

test('restoreMainAreaState should handle missing version property', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout).toEqual(savedLayout)
})

test('restoreMainAreaState should handle extra properties in saved state', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [],
  }

  const savedState = JSON.stringify({
    anotherProperty: 123,
    extraProperty: 'should be ignored',
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout).toEqual(savedLayout)
})

test('restoreMainAreaState should handle layout as non-object', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedState = JSON.stringify({
    layout: 'invalid layout',
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result).not.toBe(currentState)
  expect((result as any).layout).toBe('invalid layout')
})

test('restoreMainAreaState should handle layout with invalid direction', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'invalid' as any,
    groups: [],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.direction).toBe('invalid')
})

test('restoreMainAreaState should handle layout with invalid activeGroupId type', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 'invalid' as any,
    direction: 'horizontal',
    groups: [],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.activeGroupId).toBe('invalid')
})

test('restoreMainAreaState should handle layout with groups as non-array', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: 'not an array' as any,
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.groups).toBe('not an array')
})

test('restoreMainAreaState should handle layout with invalid group structure', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        invalid: 'group',
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.groups).toEqual(savedLayout.groups)
})

test('restoreMainAreaState should handle layout with group having invalid size', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        size: -10,
        tabs: [],
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.groups[0].size).toBe(-10)
})

test('restoreMainAreaState should handle layout with group having invalid focused type', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: 'invalid' as any,
        id: 1,
        size: 100,
        tabs: [],
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.groups[0].focused).toBe('invalid')
})

test('restoreMainAreaState should handle layout with group having invalid tabs', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        size: 100,
        tabs: 'not an array' as any,
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.groups[0].tabs).toBe('not an array')
})

test('restoreMainAreaState should handle layout with group having invalid tab structure', () => {
  const currentState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/path',
    platform: 1,
    uid: 1,
  }

  const savedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        size: 100,
        tabs: [
          {
            invalid: 'tab',
          },
        ],
      },
    ],
  }

  const savedState = JSON.stringify({
    layout: savedLayout,
    version: '1.0.0',
  })

  const result = restoreMainAreaState(savedState, currentState)

  expect(result.layout.groups[0].tabs).toEqual(savedLayout.groups[0].tabs)
})

test('restoreMainState should return valid layout', () => {
  const validLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File',
          },
        ],
      },
    ],
  }

  const result = restoreMainState(validLayout)

  expect(result).toEqual(validLayout)
})

test('restoreMainState should throw error for invalid layout - null', () => {
  expect(() => {
    restoreMainState(null)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should throw error for invalid layout - undefined', () => {
  expect(() => {
    restoreMainState(undefined)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should throw error for invalid layout - string', () => {
  expect(() => {
    restoreMainState('invalid')
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should throw error for invalid layout - number', () => {
  expect(() => {
    restoreMainState(123)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should throw error for invalid layout - missing direction', () => {
  const invalidLayout = {
    activeGroupId: 1,
    groups: [],
  }

  expect(() => {
    restoreMainState(invalidLayout)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should throw error for invalid layout - invalid direction', () => {
  const invalidLayout = {
    activeGroupId: 1,
    direction: 'invalid',
    groups: [],
  }

  expect(() => {
    restoreMainState(invalidLayout)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should throw error for invalid layout - missing groups', () => {
  const invalidLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
  }

  expect(() => {
    restoreMainState(invalidLayout)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should throw error for invalid layout - groups not array', () => {
  const invalidLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: 'not an array',
  }

  expect(() => {
    restoreMainState(invalidLayout)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should throw error for invalid layout - invalid activeGroupId type', () => {
  const invalidLayout = {
    activeGroupId: 'invalid',
    direction: 'horizontal',
    groups: [],
  }

  expect(() => {
    restoreMainState(invalidLayout)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should accept layout with undefined activeGroupId', () => {
  const validLayout = {
    activeGroupId: undefined,
    direction: 'horizontal',
    groups: [],
  }

  const result = restoreMainState(validLayout)

  expect(result).toEqual(validLayout)
})

test('restoreMainState should throw error for invalid layout - invalid group', () => {
  const invalidLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        invalid: 'group',
      },
    ],
  }

  expect(() => {
    restoreMainState(invalidLayout)
  }).toThrow('Invalid layout: value does not match MainAreaLayout type')
})

test('restoreMainState should accept layout with empty groups', () => {
  const validLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [],
  }

  const result = restoreMainState(validLayout)

  expect(result).toEqual(validLayout)
})

test('restoreMainState should accept layout with valid groups', () => {
  const validLayout = {
    activeGroupId: 1,
    direction: 'vertical',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 50,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'File',
          },
        ],
      },
      {
        activeTabId: 2,
        focused: false,
        id: 2,
        size: 50,
        tabs: [
          {
            customEditorId: 'editor-1',
            editorType: 'custom',
            editorUid: -1,
            icon: '',
            id: 2,
            isDirty: true,
            title: 'File 2',
          },
        ],
      },
    ],
  }

  const result = restoreMainState(validLayout)

  expect(result).toEqual(validLayout)
})
