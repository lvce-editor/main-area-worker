import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-large-file-warning'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const testFile = `${tmpDir}/lvce-editor-large-file-warning.txt`
  const testContent = 'large file content '.repeat(128)
  await FileSystem.writeFile(testFile, testContent)

  // Keep this file-loading regression independent of downloadable font support.
  await Settings.update({ 'editor.fontFamily': 'monospace', 'files.maxFileSizeMB': 0.001 })
  await Main.openUri(testFile)

  const warning = Locator('.EditorContentLargeFile')
  await expect(warning).toContainText('The file is not displayed in the text editor because it is very large')
  await expect(warning).toContainText('2.38 KB')
  await expect(warning).toContainText('Open Anyway')
  await expect(warning).toContainText('Configure Limit')

  const getProperty = async (locator: ReturnType<typeof Locator>, key: string): Promise<number> => {
    const { actual } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', locator, { key })
    return actual
  }
  const paneWidth = await getProperty(warning, 'clientWidth')
  const paneHeight = await getProperty(warning, 'clientHeight')
  await expect(warning).toHaveCSS('align-items', 'center')
  await expect(warning).toHaveCSS('justify-content', 'center')
  const icon = Locator('.EditorLargeFileWarningIcon')
  const message = Locator('.EditorContentLargeFile > p')
  const actions = Locator('.EditorContentLargeFileActions')
  const openAnywayButton = Locator('[data-action="open-large-file"]')
  const configureLimitButton = Locator('[data-action="configure-large-file-limit"]')
  await expect(message).toBeVisible()
  await expect(actions).toBeVisible()
  await expect(openAnywayButton).toBeVisible()
  await expect(configureLimitButton).toBeVisible()
  if ((await getProperty(message, 'scrollWidth')) > (await getProperty(message, 'clientWidth'))) {
    throw new Error('Expected the warning message to wrap within the editor pane')
  }
  for (const [name, locator] of [
    ['warning icon', icon],
    ['warning message', message],
    ['warning actions', actions],
  ] as const) {
    const left = await getProperty(locator, 'offsetLeft')
    const width = await getProperty(locator, 'offsetWidth')
    if (left < -2 || left + width > paneWidth + 2) {
      throw new Error(`Expected ${name} to stay within the editor pane: left ${left}, width ${width}, pane width ${paneWidth}`)
    }
    if (Math.abs(left + width / 2 - paneWidth / 2) > 2) {
      throw new Error(`Expected ${name} to be horizontally centered in the editor pane: left ${left}, width ${width}, pane width ${paneWidth}`)
    }
  }

  const iconTop = await getProperty(icon, 'offsetTop')
  const actionsTop = await getProperty(actions, 'offsetTop')
  const actionsHeight = await getProperty(actions, 'offsetHeight')
  if (Math.abs((iconTop + actionsTop + actionsHeight) / 2 - paneHeight / 2) > 2) {
    throw new Error('Expected the large-file warning content to be vertically centered in the editor pane')
  }

  await Command.execute('Main.handleClickAction', 'open-large-file')

  await expect(warning).toBeHidden()
  await Editor.shouldHaveText(testContent)
  const editorContent = Locator('.EditorContent')
  await expect(editorContent).toBeVisible()
}
