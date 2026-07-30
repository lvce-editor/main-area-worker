import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drag-highlight'

export const test: Test = async ({ expect, Locator, Main }) => {
  const main = Locator('.Main')
  const dragOverlay = Locator('.DragOverlay')
  const mainDragOverlay = Locator('.Main > .DragOverlay')
  const nestedDragOverlay = Locator('.editor-groups-container .DragOverlay')

  await main.dispatchEvent('dragover', { bubbles: true, clientX: 500, clientY: 300 } as any)
  await Main.handleClickAction('', '')
  await expect(dragOverlay).toBeVisible()
  await expect(mainDragOverlay).toHaveCount(1)
  await expect(nestedDragOverlay).toHaveCount(0)

  await main.dispatchEvent('dragleave', { bubbles: true } as any)
  await Main.handleClickAction('', '')
  await expect(dragOverlay).toBeHidden()
}
