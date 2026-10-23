import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-in-three-columns'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const html = `${tmpDir}/index.html`
  const css = `${tmpDir}/styles.css`
  const missing = `${tmpDir}/missing.js`

  await FileSystem.setFiles([
    { content: '<html></html>', uri: html },
    { content: 'body {}', uri: css },
  ])
  await Command.execute('MainArea.create', 85501, '', 0, 0, 900, 600, 0, tmpDir)

  for (let index = 0; index < 2; index++) {
    await Command.execute('MainArea.openUrisInThreeColumns', 85501, [html, css, missing])
    const savedState = await Command.execute('MainArea.saveState', 85501)
    assert(savedState.layout.groups.length === 3, `Expected three groups, got ${savedState.layout.groups.length}`)
    assert(
      savedState.layout.groups.map((group) => group.tabs[0]?.uri).join(',') === `${html},${css},${missing}`,
      'Expected one URI in each column, ordered HTML, CSS, and JavaScript',
    )
    assert(savedState.layout.groups[2].tabs[0]?.loadingState === 'error', 'Expected the missing file to use the editor error state')
    assert(
      savedState.layout.groups.every((group) => group.tabs.length === 1),
      'Expected repeated calls to reuse each existing tab',
    )
  }
}
