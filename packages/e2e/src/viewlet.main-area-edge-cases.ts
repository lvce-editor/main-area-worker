import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-edge-cases'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')

  const uid = 5

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file1,
  })

  const savedState1 = await Command.execute('MainArea.saveState', uid)
  assert(savedState1.layout.groups.length === 1, `Expected 1 group, got ${savedState1.layout.groups.length}`)
  assert(savedState1.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${savedState1.layout.groups[0].tabs.length}`)

  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '0')
  const savedState2 = await Command.execute('MainArea.saveState', uid)
  assert(savedState2.layout.groups[0].tabs.length === 0, `Expected 0 tabs, got ${savedState2.layout.groups[0].tabs.length}`)
  assert(savedState2.layout.groups[0].activeTabId === undefined, 'Active tab should be undefined when no tabs')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file2,
  })

  const savedState3 = await Command.execute('MainArea.saveState', uid)
  assert(savedState3.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${savedState3.layout.groups[0].tabs.length}`)
  assert(savedState3.layout.groups[0].activeTabId === savedState3.layout.groups[0].tabs[0].id, 'Active tab should be first tab')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file1,
  })

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file2,
  })

  const savedState4 = await Command.execute('MainArea.saveState', uid)
  assert(savedState4.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState4.layout.groups[0].tabs.length}`)
  const tab2 = savedState4.layout.groups[0].tabs.find((t) => t.path === file2)
  assert(tab2 !== undefined, 'Tab with file2 should exist')
  assert(savedState4.layout.groups[0].activeTabId === tab2.id, 'Active tab should be file2')

  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '0')
  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '0')
  const savedState5 = await Command.execute('MainArea.saveState', uid)
  assert(savedState5.layout.groups[0].tabs.length === 0, `Expected 0 tabs, got ${savedState5.layout.groups[0].tabs.length}`)

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file1,
  })

  const savedState6 = await Command.execute('MainArea.saveState', uid)
  assert(savedState6.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${savedState6.layout.groups[0].tabs.length}`)
  assert(savedState6.layout.groups[0].activeTabId === savedState6.layout.groups[0].tabs[0].id, 'Active tab should be first tab')
}
