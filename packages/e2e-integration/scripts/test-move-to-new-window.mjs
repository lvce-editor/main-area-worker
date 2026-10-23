import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const appRoot = resolve(process.argv[2])
const workerRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const requireApp = createRequire(join(appRoot, 'package.json'))
const { _electron: electron, expect } = requireApp('@playwright/test')
const electronPath = process.env.LVCE_ELECTRON_PATH || requireApp('electron')
const profile = await mkdtemp(join(tmpdir(), 'lvce-move-window-'))
const workspace = join(profile, 'workspace')
await mkdir(workspace)
await writeFile(join(workspace, 'saved.txt'), 'saved text')
execFileSync(process.execPath, ['-e', "require('node:v8').writeHeapSnapshot(process.argv[1])", join(workspace, 'sample.heapsnapshot')])
const env = {
  ...process.env,
  LVCE_ROOT: appRoot,
  LVCE_SHARED_PROCESS_PATH: join(appRoot, 'packages/shared-process/src/sharedProcessMain.ts'),
  DEV: '1',
}
for (const key of ['CONFIG', 'DATA', 'CACHE', 'STATE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
await mkdir(join(env.XDG_CONFIG_HOME, 'lvce-oss'), { recursive: true })
await writeFile(
  join(env.XDG_CONFIG_HOME, 'lvce-oss/settings.json'),
  JSON.stringify({
    'workbench.saveStateOnVisibilityChange': false,
    'sessionReplay.enabled': false,
    'window.titleBarStyle': 'native',
    'editor.fontFamily': 'monospace',
  }),
)
// Overlay only the task-owned build into the disposable application's installed dependency.
const installedWorker = join(appRoot, 'node_modules/@lvce-editor/main-area-worker')
if (process.env.LVCE_MOVE_USE_PUBLISHED_WORKER !== '1') {
  await cp(join(workerRoot, '.tmp/dist/dist'), join(installedWorker, 'dist'), { recursive: true })
}
const diagnostics = []
const evidenceDirectory = process.env.LVCE_MOVE_EVIDENCE_DIR
const capture = async (page, name) => {
  if (!evidenceDirectory) return
  await mkdir(evidenceDirectory, { recursive: true })
  await page.screenshot({ path: join(evidenceDirectory, `${name}.png`) })
}
let app
const execute = (page, command, ...args) =>
  page.evaluate(
    async ({ command, args }) => {
      const script = [...document.querySelectorAll('script[type="module"]')].find((node) => node.src.includes('rendererProcessMain'))
      const renderer = await import(script.src)
      await renderer.ready
      return renderer.executeCommand(command, ...args)
    },
    { command, args },
  )
const observe = (page) => {
  page.on('console', (message) => diagnostics.push(message.text()))
  page.on('pageerror', (error) => diagnostics.push(String(error)))
}
const move = async (source) => {
  const newWindow = app.waitForEvent('window', { timeout: 90_000 })
  const states = await execute(source, 'Viewlet.getAllStates')
  const main = Object.values(states).find(({ moduleId }) => moduleId === 'Main')
  const moving = execute(source, 'Viewlet.executeViewletCommand', main.uid, 'moveIntoNewWindow')
  moving.catch((error) => console.error('Move command failed:', error))
  const [, destination] = await Promise.all([moving, newWindow])
  observe(destination)
  await expect(destination.locator('.MainTab')).toHaveCount(1)
  await expect(source.locator('.MainTab')).toHaveCount(0)
  await expect(destination.locator('.ActivityBar, .SideBar, .Panel, .StatusBar')).toHaveCount(0)
  return destination
}
try {
  app = await electron.launch({
    executablePath: electronPath,
    args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, join(appRoot, 'packages/main-process'), workspace],
    env,
    timeout: 90_000,
  })
  const source = await app.firstWindow()
  observe(source)
  await expect(source.locator('.Main')).toBeVisible({ timeout: 90_000 })
  const uri = pathToFileURL(join(workspace, 'saved.txt')).toString()
  await execute(source, 'Main.openUri', uri)
  await expect(source.locator('.MainTab')).toHaveCount(1)
  let destination = await move(source)
  assert.equal((await execute(destination, 'GetActiveEditor.getTextDocument')).text, 'saved text')
  await capture(destination, 'saved-text')
  await destination.close()
  await execute(source, 'Main.openInput', { editorInput: { type: 'process-explorer' }, focus: true })
  await expect(source.locator('.ProcessExplorer')).toBeVisible()
  destination = await move(source)
  await expect(destination.locator('.ProcessExplorer')).toBeVisible()
  await expect(destination.locator('.ProcessExplorer tr')).not.toHaveCount(0)
  await capture(destination, 'process-explorer')
  await destination.close()
  const snapshotUri = pathToFileURL(join(workspace, 'sample.heapsnapshot')).toString()
  await execute(source, 'Main.openUri', snapshotUri)
  await expect(source.locator('.HeapSnapshotTable')).toBeVisible({ timeout: 90_000 })
  destination = await move(source)
  await expect(destination.locator('.HeapSnapshotTable')).toBeVisible({ timeout: 90_000 })
  await capture(destination, 'heap-snapshot')
  await destination.close()
  await execute(source, 'Main.openUri', 'untitled://1')
  let uid = await execute(source, 'GetActiveEditor.getActiveEditorId')
  await execute(source, 'Viewlet.executeViewletCommand', uid, 'setText', 'untitled unsaved text')
  destination = await move(source)
  assert.equal((await execute(destination, 'GetActiveEditor.getTextDocument')).text, 'untitled unsaved text')
  await execute(destination, 'Viewlet.executeViewletCommand', await execute(destination, 'GetActiveEditor.getActiveEditorId'), 'setText', '')
  // Remove the backing file after the source is fully loaded. The destination
  // must fail without removing the source's still-usable buffer.
  await execute(source, 'Main.openUri', uri)
  await rm(join(workspace, 'saved.txt'))
  const states = await execute(source, 'Viewlet.getAllStates')
  const main = Object.values(states).find(({ moduleId }) => moduleId === 'Main')
  const windowsBeforeFailure = app.windows().length
  await assert.rejects(execute(source, 'Viewlet.executeViewletCommand', main.uid, 'moveIntoNewWindow'))
  await expect(source.locator('.MainTab')).toHaveCount(1)
  assert.equal((await execute(source, 'GetActiveEditor.getTextDocument')).text, 'saved text')
  await expect.poll(() => app.windows().length).toBe(windowsBeforeFailure)
  await writeFile(join(workspace, 'saved.txt'), 'saved text')
  await execute(source, 'Viewlet.executeViewletCommand', main.uid, 'closeAll')
  await execute(source, 'Main.openUri', uri)
  const editorUid = await execute(source, 'GetActiveEditor.getActiveEditorId')
  await execute(source, 'Viewlet.executeViewletCommand', editorUid, 'setText', 'unsaved content')
  await execute(source, 'Viewlet.executeViewletCommand', editorUid, 'setSelections', [0, 1, 0, 5])
  await expect(source.locator('.MainTabModified')).toHaveCount(1)
  destination = await move(source)
  assert.equal((await execute(destination, 'GetActiveEditor.getTextDocument')).text, 'unsaved content')
  assert.deepEqual(await execute(destination, 'GetActiveEditor.getSelections'), [0, 1, 0, 5])
  await capture(destination, 'unsaved-text')
  assert.equal(await readFile(join(workspace, 'saved.txt'), 'utf8'), 'saved text')
  await expect(destination.locator('.MainTabModified')).toHaveCount(1)
  // Closing the original window must not retire the destination's workers.
  await source.close()
  const detachedUid = await execute(destination, 'GetActiveEditor.getActiveEditorId')
  await execute(destination, 'Viewlet.executeViewletCommand', detachedUid, 'setText', 'still usable after parent close')
  assert.equal((await execute(destination, 'GetActiveEditor.getTextDocument')).text, 'still usable after parent close')
  await capture(destination, 'parent-closed')
  // Discard test edits via the application's existing close confirmation.
  console.log(
    'Electron tab move acceptance passed: saved/dirty/untitled text, process explorer, heap snapshot, initialization failure, layout, source removal and parent close',
  )
} catch (error) {
  console.error(diagnostics.join('\n'))
  throw error
} finally {
  if (app) {
    await app.evaluate(({ app }) => app.exit(0)).catch(() => {})
    await app.close().catch(() => {})
  }
  await rm(profile, { recursive: true, force: true })
}
