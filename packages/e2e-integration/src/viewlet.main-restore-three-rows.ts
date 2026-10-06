import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-restore-three-rows'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9024
  const files = ['top.ts', 'middle.ts', 'bottom.ts'].map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles([
    { content: 'top content', uri: files[0] },
    { content: 'middle content', uri: files[1] },
    { content: 'bottom content', uri: files[2] },
  ])

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, { uri: files[0] })
  await Command.execute('MainArea.splitDown', uid)
  await Command.execute('MainArea.openUri', uid, { uri: files[1] })
  await Command.execute('MainArea.splitDown', uid)
  await Command.execute('MainArea.openUri', uid, { uri: files[2] })

  const savedState = await Command.execute('MainArea.saveState', uid)
  await Command.execute('MainArea.loadContent', uid, savedState)

  const restoredState = await Command.execute('MainArea.saveState', uid)
  assert(restoredState.layout.groups.length === 3, `Expected 3 restored groups, got ${restoredState.layout.groups.length}`)
  assert(
    restoredState.layout.groups.every((group, index) => group.tabs[0]?.uri === files[index]),
    'Expected all three files to remain in their restored groups',
  )
  assert(
    restoredState.layout.groups.map((group) => group.size).join(',') === savedState.layout.groups.map((group) => group.size).join(','),
    'Expected restored group sizes to match the saved layout',
  )

  const dom = await Command.execute('MainArea.getComponentDom', uid)
  const editorGroups = dom.filter((node) => typeof node.className === 'string' && node.className.startsWith('EditorGroup EditorGroup-'))
  const sashes = dom.filter((node) => typeof node.className === 'string' && node.className.startsWith('Sash '))
  assert(editorGroups.length === 3, `Expected 3 editor groups in the restored tree, got ${editorGroups.length}`)
  assert(sashes.length === 2, `Expected 2 sashes in the restored tree, got ${sashes.length}`)
  assert(
    dom.every((node) => node.text !== 'undefined'),
    'Expected no stray undefined text in the restored tree',
  )

  await Command.execute('MainArea.selectTab', uid, 0, 0)
  const selectedState = await Command.execute('MainArea.saveState', uid)
  assert(selectedState.layout.activeGroupId === restoredState.layout.groups[0].id, 'Expected the restored first group tab to remain selectable')
}
