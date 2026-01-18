import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-groups'
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

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')
  await FileSystem.writeFile(file4, 'content4')

  const uid = 2

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

  const savedState1 = await Command.execute('MainArea.saveState', uid)
  assert(savedState1.layout.groups.length === 1, `Expected 1 group, got ${savedState1.layout.groups.length}`)
  assert(savedState1.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState1.layout.groups[0].tabs.length}`)

  const groupId = savedState1.layout.groups[0].id

  await Command.execute('MainArea.handleClick', uid, 'split-right', { groupId: String(groupId) })
  const savedState2 = await Command.execute('MainArea.saveState', uid)
  assert(savedState2.layout.groups.length === 2, `Expected 2 groups, got ${savedState2.layout.groups.length}`)
  assert(savedState2.layout.direction === 'horizontal', `Expected horizontal direction, got ${savedState2.layout.direction}`)

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file3,
  })

  const savedState3 = await Command.execute('MainArea.saveState', uid)
  const focusedGroup = savedState3.layout.groups.find((g) => g.focused)
  assert(focusedGroup !== undefined, 'Focused group should exist')
  assert(focusedGroup.tabs.some((t) => t.path === file3), 'Focused group should contain file3')

  await Command.execute('MainArea.selectTab', uid, 0, 0)
  const savedState4 = await Command.execute('MainArea.saveState', uid)
  assert(savedState4.layout.groups[0].focused === true, 'First group should be focused')
  assert(savedState4.layout.groups[1].focused === false, 'Second group should not be focused')

  await Command.execute('MainArea.selectTab', uid, 1, 0)
  const savedState5 = await Command.execute('MainArea.saveState', uid)
  assert(savedState5.layout.groups[1].focused === true, 'Second group should be focused')
  assert(savedState5.layout.groups[0].focused === false, 'First group should not be focused')

  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file4,
  })

  const savedState6 = await Command.execute('MainArea.saveState', uid)
  const focusedGroup2 = savedState6.layout.groups.find((g) => g.focused)
  assert(focusedGroup2 !== undefined, 'Focused group should exist')
  assert(focusedGroup2.tabs.some((t) => t.path === file4), 'Focused group should contain file4')
}
