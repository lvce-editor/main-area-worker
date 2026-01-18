import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tabs-and-groups'

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
  const file4 = `${tmpDir}/file4.ts`
  const file5 = `${tmpDir}/file5.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')
  await FileSystem.writeFile(file4, 'content4')
  await FileSystem.writeFile(file5, 'content5')

  const uid = 1

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
  assert(savedState1.layout.groups.length === 1, `Expected 1 group, got ${savedState1.layout.groups.length}`)
  assert(savedState1.layout.groups[0].tabs.length === 3, `Expected 3 tabs, got ${savedState1.layout.groups[0].tabs.length}`)

  await Command.execute('MainArea.selectTab', uid, 0, 1)
  const savedState2 = await Command.execute('MainArea.saveState', uid)
  assert(savedState2.layout.groups[0].activeTabId === savedState2.layout.groups[0].tabs[1].id, 'Active tab should be second tab')

  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '0')
  const savedState3 = await Command.execute('MainArea.saveState', uid)
  assert(savedState3.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState3.layout.groups[0].tabs.length}`)

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file1,
  })
  const savedState4 = await Command.execute('MainArea.saveState', uid)
  assert(savedState4.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState4.layout.groups[0].tabs.length}`)
  const tab1 = savedState4.layout.groups[0].tabs.find((t) => t.path === file1)
  assert(tab1 !== undefined, 'Tab with file1 should exist')
  assert(savedState4.layout.groups[0].activeTabId === tab1.id, 'Active tab should be file1')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file4,
  })
  const savedState5 = await Command.execute('MainArea.saveState', uid)
  assert(savedState5.layout.groups[0].tabs.length === 3, `Expected 3 tabs, got ${savedState5.layout.groups[0].tabs.length}`)

  await Command.execute('MainArea.selectTab', uid, 0, 0)
  const savedState6 = await Command.execute('MainArea.saveState', uid)
  assert(savedState6.layout.groups[0].activeTabId === savedState6.layout.groups[0].tabs[0].id, 'Active tab should be first tab')

  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '2')
  const savedState7 = await Command.execute('MainArea.saveState', uid)
  assert(savedState7.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState7.layout.groups[0].tabs.length}`)

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file5,
  })
  const savedState8 = await Command.execute('MainArea.saveState', uid)
  assert(savedState8.layout.groups[0].tabs.length === 3, `Expected 3 tabs, got ${savedState8.layout.groups[0].tabs.length}`)
  const tab5 = savedState8.layout.groups[0].tabs.find((t) => t.path === file5)
  assert(tab5 !== undefined, 'Tab with file5 should exist')
  assert(savedState8.layout.groups[0].activeTabId === tab5.id, 'Active tab should be file5')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file2,
  })
  const savedState9 = await Command.execute('MainArea.saveState', uid)
  assert(savedState9.layout.groups[0].tabs.length === 3, `Expected 3 tabs, got ${savedState9.layout.groups[0].tabs.length}`)
  const tab2 = savedState9.layout.groups[0].tabs.find((t) => t.path === file2)
  assert(tab2 !== undefined, 'Tab with file2 should exist')
  assert(savedState9.layout.groups[0].activeTabId === tab2.id, 'Active tab should be file2')

  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '0')
  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '0')
  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '0')
  const savedState10 = await Command.execute('MainArea.saveState', uid)
  assert(savedState10.layout.groups[0].tabs.length === 0, `Expected 0 tabs, got ${savedState10.layout.groups[0].tabs.length}`)
  assert(savedState10.layout.groups[0].activeTabId === undefined, 'Active tab should be undefined when no tabs')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file1,
  })
  const savedState11 = await Command.execute('MainArea.saveState', uid)
  assert(savedState11.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${savedState11.layout.groups[0].tabs.length}`)
  assert(savedState11.layout.groups[0].activeTabId === savedState11.layout.groups[0].tabs[0].id, 'Active tab should be first tab')
}
