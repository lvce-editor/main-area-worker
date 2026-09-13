import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-sash-horizontal'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const waitForNextFrame = async (): Promise<void> => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  }

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
  const pointerDown = { bubbles: true, button: 0, buttons: 1, clientX: 1, clientY: 200, pointerId: 1, pointerType: 'mouse' }
  const editorGroups = Locator('.EditorGroup')
  const firstGroup = editorGroups.first()
  const secondGroup = editorGroups.nth(1)
  const { actual: initialFirstGroupWidth } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', firstGroup, {
    key: 'clientWidth',
  })
  const { actual: initialSecondGroupWidth } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', secondGroup, {
    key: 'clientWidth',
  })

  await border.dispatchEvent('pointerdown', pointerDown as any)
  await waitForNextFrame()
  await border.dispatchEvent('pointermove', { ...pointerDown, clientX: 900 } as any)
  await waitForNextFrame()
  await border.dispatchEvent('pointerup', { ...pointerDown, buttons: 0, clientX: 900 } as any)
  await border.dispatchEvent('lostpointercapture', {} as any)
  await waitForNextFrame()

  const { actual: resizedFirstGroupWidth } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', firstGroup, {
    key: 'clientWidth',
  })
  const { actual: resizedSecondGroupWidth } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', secondGroup, {
    key: 'clientWidth',
  })
  if (resizedFirstGroupWidth === initialFirstGroupWidth || resizedSecondGroupWidth === initialSecondGroupWidth) {
    throw new Error(
      `Expected dragging the sash border to resize both editor groups: ${initialFirstGroupWidth} -> ${resizedFirstGroupWidth}, ${initialSecondGroupWidth} -> ${resizedSecondGroupWidth}`,
    )
  }

  await border.dispatchEvent('pointerdown', { ...pointerDown, clientX: 900 } as any)
  await waitForNextFrame()
  await border.dispatchEvent('pointermove', { ...pointerDown, clientX: 1 } as any)
  await waitForNextFrame()
  await border.dispatchEvent('pointerup', { ...pointerDown, buttons: 0, clientX: 1 } as any)
  await border.dispatchEvent('lostpointercapture', {} as any)
  await waitForNextFrame()

  const { actual: restoredFirstGroupWidth } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', firstGroup, {
    key: 'clientWidth',
  })
  if (restoredFirstGroupWidth === resizedFirstGroupWidth) {
    throw new Error('Expected a second sash border drag to resize the editor groups again')
  }
}
