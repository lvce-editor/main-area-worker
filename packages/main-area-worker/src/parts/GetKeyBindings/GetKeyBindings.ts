import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'

export const getKeyBindings = (): readonly any[] => {
  return [
    {
      command: 'Main.closeActiveEditor',
      key: KeyModifier.CtrlCmd | KeyCode.KeyW,
    },
    {
      command: 'Main.focusNext',
      key: KeyModifier.CtrlCmd | KeyCode.Tab,
    },
    {
      command: 'Main.focusPrevious',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Tab,
    },
    {
      command: 'Main.focus',
      key: KeyModifier.CtrlCmd | KeyCode.Digit1,
    },
    {
      command: 'Main.save',
      key: KeyModifier.CtrlCmd | KeyCode.KeyS,
    },
    {
      command: 'Main.splitRight',
      key: KeyModifier.CtrlCmd | KeyCode.Backslash,
    },
  ]
}
