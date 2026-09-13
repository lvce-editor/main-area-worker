import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-sash-vertical'

const firstGroupHeight = /^(?:[5-9]\d\d|1\d{3})(?:\.\d+)?px$/
const secondGroupHeight = /^8\d(?:\.\d+)?px$/
const minimumGroupHeight = /^250(?:\.\d+)?px$/

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`

  await FileSystem.setFiles([
    { content: 'content1', uri: file1 },
    { content: 'content2', uri: file2 },
  ])

  await Main.openUri(file1)
  await Main.splitDown()

  const sash = Locator('.Main .SashHorizontal')
  await expect(sash).toBeVisible()
  await expect(sash).toHaveCount(1)

  const border = sash.locator('.SashBorder')
  const pointerDown = { bubbles: true, button: 0, clientX: 500, clientY: 1, pointerId: 1 }
  await border.dispatchEvent('pointerdown', pointerDown as any)
  await border.dispatchEvent('pointermove', { ...pointerDown, clientY: 600 } as any)
  await border.dispatchEvent('pointerup', { ...pointerDown, clientY: 600 } as any)

  const editorGroups = Locator('.EditorGroup')
  const firstGroup = editorGroups.first()
  const secondGroup = editorGroups.nth(1)
  await expect(firstGroup).toHaveCSS('height', firstGroupHeight as any)
  await expect(secondGroup).toHaveCSS('height', secondGroupHeight as any)

  await border.dispatchEvent('pointerdown', { ...pointerDown, clientY: 600 } as any)
  await border.dispatchEvent('pointermove', { ...pointerDown, clientY: 1 } as any)
  await border.dispatchEvent('pointerup', { ...pointerDown, clientY: 1 } as any)

  await expect(firstGroup).toHaveCSS('height', minimumGroupHeight as any)
}
