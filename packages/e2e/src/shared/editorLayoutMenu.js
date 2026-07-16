// @ts-check

/**
 * @typedef {import('@lvce-editor/test-with-playwright').TestApi} TestApi
 * @typedef {Pick<TestApi, 'Command' | 'expect' | 'FileSystem' | 'Locator' | 'Main' | 'TitleBarMenuBar'>} EditorLayoutMenuApi
 * @typedef {(api: EditorLayoutMenuApi) => Promise<void>} AssertEditorLayout
 */

/**
 * @param {EditorLayoutMenuApi} api
 * @param {string} fileName
 * @returns {Promise<void>}
 */
export const prepareEditorLayoutTest = async ({ FileSystem, Main }, fileName) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'editor layout menu test')
  await Main.openUri(file)
}

/**
 * @param {EditorLayoutMenuApi} api
 * @param {string} label
 * @param {number} index
 * @param {number} [matchingIndex]
 * @returns {Promise<void>}
 */
export const selectEditorLayoutMenuItem = async ({ Command, expect, Locator, TitleBarMenuBar }, label, index, matchingIndex = 0) => {
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)

  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: label }).nth(matchingIndex)
  await expect(menuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, index)
}

/**
 * @param {EditorLayoutMenuApi} api
 * @param {string} fileName
 * @param {string} label
 * @param {number} index
 * @param {AssertEditorLayout} assertEditorLayout
 * @param {number} [matchingIndex]
 * @returns {Promise<void>}
 */
export const runEditorLayoutMenuTest = async (api, fileName, label, index, assertEditorLayout, matchingIndex = 0) => {
  await prepareEditorLayoutTest(api, fileName)
  await selectEditorLayoutMenuItem(api, label, index, matchingIndex)
  await assertEditorLayout(api)
}
