import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-sash-vertical'

const waitForNextFrame = async (): Promise<void> => {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
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
  const pointerDown = { bubbles: true, button: 0, buttons: 1, clientX: 500, clientY: 1, pointerId: 1, pointerType: 'mouse' }
  const editorGroups = Locator('.EditorGroup')
  const firstGroup = editorGroups.first()
  const secondGroup = editorGroups.nth(1)
  const { actual: initialFirstGroupHeight } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', firstGroup, {
    key: 'clientHeight',
  })
  const { actual: initialSecondGroupHeight } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', secondGroup, {
    key: 'clientHeight',
  })

  await Command.execute('PointerCapture.mock')
  await border.dispatchEvent('pointerdown', pointerDown as any)
  await waitForNextFrame()
  await border.dispatchEvent('pointermove', { ...pointerDown, clientY: 600 } as any)
  await waitForNextFrame()
  await border.dispatchEvent('pointerup', { ...pointerDown, buttons: 0, clientY: 600 } as any)
  await border.dispatchEvent('lostpointercapture', {} as any)
  await waitForNextFrame()

  const { actual: resizedFirstGroupHeight } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', firstGroup, {
    key: 'clientHeight',
  })
  const { actual: resizedSecondGroupHeight } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', secondGroup, {
    key: 'clientHeight',
  })
  if (resizedFirstGroupHeight === initialFirstGroupHeight || resizedSecondGroupHeight === initialSecondGroupHeight) {
    throw new Error(
      `Expected dragging the sash border to resize both editor groups: ${initialFirstGroupHeight} -> ${resizedFirstGroupHeight}, ${initialSecondGroupHeight} -> ${resizedSecondGroupHeight}`,
    )
  }

  await border.dispatchEvent('pointerdown', { ...pointerDown, clientY: 600 } as any)
  await waitForNextFrame()
  await border.dispatchEvent('pointermove', { ...pointerDown, clientY: 1 } as any)
  await waitForNextFrame()
  await border.dispatchEvent('pointerup', { ...pointerDown, buttons: 0, clientY: 1 } as any)
  await border.dispatchEvent('lostpointercapture', {} as any)
  await waitForNextFrame()

  const { actual: restoredFirstGroupHeight } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', firstGroup, {
    key: 'clientHeight',
  })
  if (restoredFirstGroupHeight === resizedFirstGroupHeight) {
    throw new Error('Expected a second sash border drag to resize the editor groups again')
  }
  await Command.execute('PointerCapture.unmock')
}
