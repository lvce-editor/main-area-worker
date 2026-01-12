import type { UiStatusBarItem } from '../UiStatusBarItem/UiStatusBarItem.ts'

export const toUiStatusBarItem = (extensionHostStatusBarItem: any): UiStatusBarItem => {
  return {
    command: extensionHostStatusBarItem.command || '',
    icon: extensionHostStatusBarItem.icon || '',
    name: extensionHostStatusBarItem.id || extensionHostStatusBarItem.name || '',
    text: extensionHostStatusBarItem.text || '',
    tooltip: extensionHostStatusBarItem.tooltip || '',
  }
}
