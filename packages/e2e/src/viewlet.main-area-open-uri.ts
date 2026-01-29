import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uri'

export const test: Test = async ({ Command, FileSystem, Main, Editor }) => {
  const tmpDir = await FileSystem.getTmpDir(Editor)
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'

  // Create test file with content
  await FileSystem.writeFile(testFile, testContent)

  // Create main area
  await Main.openUri(testFile)

  // Open the editor
  await Command.execute('MainArea.openUri', uid, {
    focus: false,
    preview: false,
    uri: testFile,
  })

  // Verify editor is opened
  const savedState = await Command.execute('MainArea.saveState', uid)
  assert(savedState.layout.groups.length === 1, `Expected 1 group, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${savedState.layout.groups[0].tabs.length}`)

  const tab = savedState.layout.groups[0].tabs[0]
  assert(tab.path === testFile, `Expected tab path to be ${testFile}, got ${tab.path}`)
  assert(savedState.layout.groups[0].activeTabId === tab.id, 'Editor should be active')

  // Load the tab content
  await Command.execute('MainArea.loadTabContent', uid, tab.id)

  // Get the editor content via rendering
  const vdom = await Command.execute('MainArea.getMainAreaVirtualDom', uid)
  assert(vdom !== undefined, 'Virtual DOM should be defined')
  assert(vdom !== null, 'Virtual DOM should not be null')

  // Verify the file content is present in the rendered output
  const vdomString = JSON.stringify(vdom)
  assert(vdomString.includes('hello') || vdomString.includes('world'), 'File content should be visible in rendered output')
  assert(vdomString.includes('test.ts'), 'File name should be visible in tab')
}
