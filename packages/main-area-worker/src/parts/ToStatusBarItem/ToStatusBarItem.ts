import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { UiStatusBarItem } from '../UiStatusBarItem/UiStatusBarItem.ts'

export const toStatusBarItem = (uiStatusBarItem: UiStatusBarItem): StatusBarItem => {
  const elements: Array<StatusBarItem['elements'][number]> = []
  if (uiStatusBarItem.icon) {
    elements.push({ type: 'icon', value: uiStatusBarItem.icon })
  }
  if (uiStatusBarItem.text) {
    elements.push({ type: 'text', value: uiStatusBarItem.text })
  }
  if (elements.length === 0) {
    elements.push({ type: 'text', value: '' })
  }
  return {
    command: uiStatusBarItem.command || undefined,
    elements,
    name: uiStatusBarItem.name,
    tooltip: uiStatusBarItem.tooltip,
  }
}
