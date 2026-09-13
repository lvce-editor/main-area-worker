import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-sash-horizontal'

const firstGroupWidth = /^(?:[7-9]\d\d|1\d{3})px$/
const secondGroupWidth = /^25\dpx$/
const restoredGroupWidth = /^(?:[4-6]\d\d)px$/

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`

  await FileSystem.setFiles([
    { content: 'content1', uri: file1 },
    { content: 'content2', uri: file2 },
  ])

  await Main.openUri(file1)
  await Main.splitRight()

  const sash = Locator('.Main .SashVertical')
  await expect(sash).toBeVisible()
  await expect(sash).toHaveCount(1)

  const border = sash.locator('.SashBorder')
  const pointerDown = { bubbles: true, button: 0, clientX: 1, clientY: 200, pointerId: 1 }
  await border.dispatchEvent('pointerdown', pointerDown as any)
  await border.dispatchEvent('pointermove', { ...pointerDown, clientX: 900 } as any)
  await border.dispatchEvent('pointerup', { ...pointerDown, clientX: 900 } as any)

  const editorGroups = Locator('.EditorGroup')
  const firstGroup = editorGroups.first()
  const secondGroup = editorGroups.nth(1)
  await expect(firstGroup).toHaveCSS('width', firstGroupWidth as any)
  await expect(secondGroup).toHaveCSS('width', secondGroupWidth as any)

  await border.dispatchEvent('pointerdown', { ...pointerDown, clientX: 900 } as any)
  await border.dispatchEvent('pointermove', { ...pointerDown, clientX: 1 } as any)
  await border.dispatchEvent('pointerup', { ...pointerDown, clientX: 1 } as any)

  await expect(firstGroup).toHaveCSS('width', restoredGroupWidth as any)
}
