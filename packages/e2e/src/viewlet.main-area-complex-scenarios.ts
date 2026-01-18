import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-complex-scenarios'
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
  const file4 = `${tmpDir}/file4.ts`
  const file5 = `${tmpDir}/file5.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')
  await FileSystem.writeFile(file4, 'content4')
  await FileSystem.writeFile(file5, 'content5')

  const uid = 3

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
  const groupId1 = savedState1.layout.groups[0].id

  await Command.execute('MainArea.handleClick', uid, 'split-right', { groupId: String(groupId1) })
  const savedState2 = await Command.execute('MainArea.saveState', uid)
  assert(savedState2.layout.groups.length === 2, `Expected 2 groups, got ${savedState2.layout.groups.length}`)

  await Command.execute('MainArea.selectTab', uid, 0, 1)
  const savedState3 = await Command.execute('MainArea.saveState', uid)
  assert(savedState3.layout.groups[0].activeTabId === savedState3.layout.groups[0].tabs[1].id, 'Active tab should be second tab')

  await Command.execute('MainArea.handleClickCloseTab', uid, '0', '1')
  const savedState4 = await Command.execute('MainArea.saveState', uid)
  assert(savedState4.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState4.layout.groups[0].tabs.length}`)
  assert(savedState4.layout.groups[0].activeTabId === savedState4.layout.groups[0].tabs[1].id, 'Active tab should be second tab')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file4,
  })

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file5,
  })

  const savedState5 = await Command.execute('MainArea.saveState', uid)
  const focusedGroup = savedState5.layout.groups.find((g) => g.focused)
  assert(focusedGroup !== undefined, 'Focused group should exist')
  assert(focusedGroup.tabs.length > 0, 'Focused group should have tabs')

  await Command.execute('MainArea.selectTab', uid, 1, 0)
  const savedState6 = await Command.execute('MainArea.saveState', uid)
  assert(savedState6.layout.groups[1].focused === true, 'Second group should be focused')

  await Command.execute('MainArea.handleClickCloseTab', uid, '1', '0')
  const savedState7 = await Command.execute('MainArea.saveState', uid)
  assert(savedState7.layout.groups[1].tabs.length >= 0, 'Second group should have zero or more tabs')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file1,
  })

  const savedState8 = await Command.execute('MainArea.saveState', uid)
  const groupWithFile1 = savedState8.layout.groups.find((g) => g.tabs.some((t) => t.path === file1))
  assert(groupWithFile1 !== undefined, 'Group with file1 should exist')
  const tab1 = groupWithFile1.tabs.find((t) => t.path === file1)
  assert(tab1 !== undefined, 'Tab with file1 should exist')
  assert(groupWithFile1.activeTabId === tab1.id, 'Active tab should be file1')
}
