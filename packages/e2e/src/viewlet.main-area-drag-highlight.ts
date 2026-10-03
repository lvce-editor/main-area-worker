import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drag-highlight'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  const main = Locator('.Main')
  const dragOverlay = Locator('.DragOverlay')
  const mainDragOverlay = Locator('.Main > .DragOverlay')
  const nestedDragOverlay = Locator('.EditorGroupsContainer .DragOverlay')

  await Command.execute('TestFrameWork.performAction', main, 'dispatchEvent', {
    init: { bubbles: true, clientX: 500, clientY: 300 } as any,
    type: 'dragover',
  })
  await Main.handleClickAction('', '')
  await expect(dragOverlay).toBeVisible()
  await expect(mainDragOverlay).toHaveCount(1)
  await expect(nestedDragOverlay).toHaveCount(0)

  await Command.execute('TestFrameWork.performAction', main, 'dispatchEvent', { init: { bubbles: true } as any, type: 'dragleave' })
  await Main.handleClickAction('', '')
  await expect(dragOverlay).toBeHidden()
}
