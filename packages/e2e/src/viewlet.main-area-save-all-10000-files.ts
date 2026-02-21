import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-save-all-10000-files'

export const skip = 1

const fileCount = 10_000
const batchSize = 100

const createFiles = async (tmpDir: string, FileSystem: any): Promise<string[]> => {
  const files: string[] = []
  for (let start = 0; start < fileCount; start += batchSize) {
    const end = Math.min(start + batchSize, fileCount)
    const batchPromises: Promise<void>[] = []
    for (let i = start; i < end; i++) {
      const filePath = `${tmpDir}/file-${i}.ts`
      const fileContent = `export const file${i} = () => "content-${i}"`
      files.push(filePath)
      batchPromises.push(FileSystem.writeFile(filePath, fileContent))
    }
    await Promise.all(batchPromises)
  }
  return files
}

const openFiles = async (files: readonly string[], Main: any): Promise<void> => {
  for (let start = 0; start < files.length; start += batchSize) {
    const end = Math.min(start + batchSize, files.length)
    const batch = files.slice(start, end)
    await Promise.all(batch.map((filePath) => Main.openUri(filePath)))
  }
}

const editFiles = async (fileCount: number, Command: any, Editor: any): Promise<void> => {
  for (let i = 0; i < fileCount; i++) {
    await Command.execute('Main.selectTab', 0, i)
    await Editor.setCursor(0, 0)
    await Editor.type('a')
  }
}

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = await createFiles(tmpDir, FileSystem)

  await openFiles(files, Main)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(fileCount)

  await editFiles(fileCount, Command, Editor)

  const modifiedTabs = Locator('.MainTabModified')
  await expect(modifiedTabs).toHaveCount(fileCount)

  await Command.execute('Main.saveAll')

  await expect(modifiedTabs).toHaveCount(0)
}
