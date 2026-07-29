import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drag-highlight'

export const test: Test = async ({ Command, expect, Locator }) => {
  const dragOverlay = Locator('.DragOverlay')

  await Command.execute('Main.handleDragOver', 500, 300)
  await expect(dragOverlay).toBeVisible()

  await Command.execute('Main.handleDragLeave')
  await expect(dragOverlay).toBeHidden()
}
