import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drag-highlight'

export const test: Test = async ({ expect, Locator }) => {
  const main = Locator('.Main')
  const dragOverlay = Locator('.DragOverlay')

  await main.dispatchEvent('dragover', { bubbles: true, clientX: 500, clientY: 300 } as any)
  await expect(dragOverlay).toBeVisible()

  await main.dispatchEvent('dragleave', { bubbles: true } as any)
  await expect(dragOverlay).toBeHidden()
}
