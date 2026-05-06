import { expect, test } from '@jest/globals'
import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings should include restore closed tab shortcut', () => {
  const keyBindings = getKeyBindings()

  expect(keyBindings).toContainEqual({
    command: 'Main.restoreClosedTab',
    key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyW,
  })
})