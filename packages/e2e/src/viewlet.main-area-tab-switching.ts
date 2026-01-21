import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-switching'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  const file3 = `${tmpDir}/file3.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')

  const uid = 4

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

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

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file3,
  })

  const savedState1 = await Command.execute('MainArea.saveState', uid)
  assert(savedState1.layout.groups[0].tabs.length === 3, `Expected 3 tabs, got ${savedState1.layout.groups[0].tabs.length}`)

  await Command.execute('MainArea.selectTab', uid, 0, 0)
  const savedState2 = await Command.execute('MainArea.saveState', uid)
  assert(savedState2.layout.groups[0].activeTabId === savedState2.layout.groups[0].tabs[0].id, 'Active tab should be first tab')

  await Command.execute('MainArea.selectTab', uid, 0, 1)
  const savedState3 = await Command.execute('MainArea.saveState', uid)
  assert(savedState3.layout.groups[0].activeTabId === savedState3.layout.groups[0].tabs[1].id, 'Active tab should be second tab')

  await Command.execute('MainArea.selectTab', uid, 0, 2)
  const savedState4 = await Command.execute('MainArea.saveState', uid)
  assert(savedState4.layout.groups[0].activeTabId === savedState4.layout.groups[0].tabs[2].id, 'Active tab should be third tab')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file1,
  })

  const savedState5 = await Command.execute('MainArea.saveState', uid)
  assert(savedState5.layout.groups[0].tabs.length === 3, `Expected 3 tabs, got ${savedState5.layout.groups[0].tabs.length}`)
  const tab1 = savedState5.layout.groups[0].tabs.find((t) => t.path === file1)
  assert(tab1 !== undefined, 'Tab with file1 should exist')
  assert(savedState5.layout.groups[0].activeTabId === tab1.id, 'Active tab should be file1')

  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '1')
  const savedState6 = await Command.execute('MainArea.saveState', uid)
  assert(savedState6.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState6.layout.groups[0].tabs.length}`)

  await Command.execute('MainArea.selectTab', uid, 0, 0)
  const savedState7 = await Command.execute('MainArea.saveState', uid)
  assert(savedState7.layout.groups[0].activeTabId === savedState7.layout.groups[0].tabs[0].id, 'Active tab should be first tab')
}
