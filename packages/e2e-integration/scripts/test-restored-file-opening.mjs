import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const appRoot = resolve(process.argv[2])
const workerRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const requireApp = createRequire(join(appRoot, 'package.json'))
const { _electron: electron, expect } = requireApp('@playwright/test')
const electronPath = process.env.LVCE_ELECTRON_PATH || requireApp('electron')
const profile = await mkdtemp(join(tmpdir(), 'lvce-restored-file-opening-'))
const evidence = process.env.LVCE_RESTORE_EVIDENCE_DIR
const workspace = join(profile, 'workspace')
const names = ['LICENSE', 'README.md', 'GetInspectorProcessId.test.ts']
const contents = ['license content', '# Readme content', 'export const testValue = 42']
const diagnostics = []
const env = {
  ...process.env,
  LVCE_ROOT: appRoot,
  LVCE_SHARED_PROCESS_PATH: join(appRoot, 'packages/shared-process/src/sharedProcessMain.ts'),
  DEV: '1',
}
for (const key of ['CONFIG', 'DATA', 'CACHE', 'STATE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
let app
let page
const execute = (command, ...args) =>
  page.evaluate(
    async ({ command, args }) => {
      const script = [...document.querySelectorAll('script[type="module"]')].find((node) => node.src.includes('rendererProcessMain'))
      const renderer = await import(script.src)
      await renderer.ready
      return renderer.executeCommand(command, ...args)
    },
    { command, args },
  )
const getMainState = async () => {
  const states = await execute('Viewlet.getAllStates')
  const main = Object.values(states).find(({ moduleId }) => moduleId === 'Main')
  return execute('ComponentState.getState', main.uid)
}
const capture = async (label) => {
  if (!evidence || !page) return
  await mkdir(evidence, { recursive: true })
  await page.screenshot({ path: join(evidence, `${label}.png`) })
  await writeFile(join(evidence, `${label}.json`), JSON.stringify(await getMainState(), null, 2))
}
const verify = async (index) => {
  await expect(page.locator(`.MainTabSelected[title$="${names[index]}"]`)).toBeVisible()
  await expect(page.locator('.Main .Editor')).toContainText(contents[index])
}
try {
  await mkdir(workspace)
  await Promise.all(names.map((name, index) => writeFile(join(workspace, name), contents[index])))
  await mkdir(join(env.XDG_CONFIG_HOME, 'lvce-oss'), { recursive: true })
  await writeFile(
    join(env.XDG_CONFIG_HOME, 'lvce-oss/settings.json'),
    JSON.stringify({ 'sessionReplay.enabled': false, 'window.titleBarStyle': 'native', 'editor.fontFamily': 'monospace' }),
  )
  if (process.env.LVCE_RESTORE_USE_PUBLISHED_WORKER !== '1') {
    await cp(join(workerRoot, '.tmp/dist/dist'), join(appRoot, 'node_modules/@lvce-editor/main-area-worker/dist'), { recursive: true })
  }
  app = await electron.launch({
    executablePath: electronPath,
    args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, join(appRoot, 'packages/main-process'), workspace],
    env,
    timeout: 90_000,
  })
  page = await app.firstWindow()
  page.on('console', (message) => diagnostics.push(message.text()))
  page.on('pageerror', (error) => diagnostics.push(String(error)))
  await expect(page.locator('.Main')).toBeVisible({ timeout: 90_000 })
  const uris = names.map((name) => pathToFileURL(join(workspace, name)).toString())
  for (let index = 0; index < uris.length; index++) {
    await execute('Main.openUri', { uri: uris[index], preview: index === uris.length - 1 })
    await verify(index)
  }
  await execute('SaveState.handleVisibilityChange', 'hidden')
  await page.reload()
  await expect(page.locator('.MainTab')).toHaveCount(3)
  await verify(2)
  const restored = await getMainState()
  if (restored.layout.groups[0].tabs[0].editorUid !== -1) throw new Error('Expected inactive restored tab to be unloaded')
  await capture('restored')
  // Opening through the explorer/quick-open path must load the existing tab.
  // A tab click has a separate loading path and would mask the regression.
  await execute('Main.openUri', uris[0])
  await verify(0)
  await execute('Main.openUri', uris[1])
  await verify(1)
  for (let cycle = 0; cycle < 5; cycle++) {
    for (let index = 0; index < names.length; index++) {
      await page.locator(`.MainTab[title$="${names[index]}"]`).click()
      await verify(index)
    }
  }
  // Pin the preview before opening an additional editor.
  await execute('Main.openUri', uris[2])
  const mainState = await getMainState()
  await execute('Main.openUri', `live-component-state:///${mainState.uid}.json`)
  await expect(page.locator('.Main .Editor')).toContainText('activeGroupId')
  for (let index = 0; index < names.length; index++) {
    await page.locator(`.MainTab[title$="${names[index]}"]`).click()
    await verify(index)
  }
  // Control readiness through the public component-state API while retaining real
  // editor viewlets. This makes the slow path deterministic on every CI platform.
  await execute('Main.openUri', uris[0])
  const baseline = await getMainState()
  const group = baseline.layout.groups[0]
  const outgoing = group.tabs.find((tab) => tab.id === group.activeTabId)
  const incoming = group.tabs.find((tab) => tab.uri === uris[1])
  const pending = structuredClone(baseline)
  pending.layout.groups[0].activeTabId = incoming.id
  pending.layout.groups[0].tabs.find((tab) => tab.id === incoming.id).loadingState = 'loading'
  await page.evaluate(() => {
    const container = document.querySelector('.Main .EditorContainer')
    globalThis.paintSamples = []
    globalThis.paintOriginal = container.querySelector('.Editor')
    globalThis.paintInputEvents = []
    globalThis.paintKeyProbe = (event) => {
      if (event.key !== 'x') return
      globalThis.paintProbe = {
        inert: container.inert,
        original: container.querySelector('.Editor') === globalThis.paintOriginal,
        targetInside: globalThis.paintOriginal.contains(event.target),
      }
    }
    document.addEventListener('keydown', globalThis.paintKeyProbe, true)
    for (const type of ['keydown', 'input']) {
      globalThis.paintOriginal.addEventListener(type, (event) => globalThis.paintInputEvents.push(event.type))
    }
    const sample = () => {
      globalThis.paintSamples.push({
        time: performance.now(),
        original: container.querySelector('.Editor') === globalThis.paintOriginal,
        inert: container.inert,
        loading: Boolean(container.querySelector('.TextEditor--loading')),
        activeInside: container.contains(document.activeElement),
      })
    }
    globalThis.paintObserver = new MutationObserver(sample)
    globalThis.paintObserver.observe(container, { attributes: true, childList: true, subtree: true })
    sample()
  })
  await execute('ComponentState.setState', baseline.uid, pending)
  // Chromium can retain activeElement briefly after inert is set. Check actual
  // keyboard delivery instead of treating that transient focus report as input.
  await page.keyboard.press('x')
  const input = await page.evaluate(() => {
    document.removeEventListener('keydown', globalThis.paintKeyProbe, true)
    return { events: globalThis.paintInputEvents, probe: globalThis.paintProbe }
  })
  if (evidence) await writeFile(join(evidence, 'paint-input.json'), JSON.stringify(input, null, 2))
  if (!input.probe?.inert || !input.probe.original) throw new Error(`Keyboard probe missed the hold: ${JSON.stringify(input)}`)
  if (input.events.length || input.probe.targetInside) throw new Error(`Held editor received keyboard input: ${JSON.stringify(input)}`)
  await expect(page.locator('.Main .TextEditor--loading')).toBeVisible()
  await expect(page.locator('.Main .TextEditor--loading .AnimationSpin')).toBeVisible()
  await expect(page.locator('.Main .TextEditor--loading .AnimationSpin')).toHaveCSS('animation-name', 'spin')
  const samples = await page.evaluate(() => {
    globalThis.paintObserver.disconnect()
    return globalThis.paintSamples
  })
  if (evidence) await writeFile(join(evidence, 'paint-samples.json'), JSON.stringify(samples, null, 2))
  const held = samples.find((sample) => sample.original && sample.inert)
  const spinner = samples.find((sample) => sample.loading)
  if (!held || !spinner || spinner.time - held.time < 50) {
    throw new Error(`Expected a visible paint hold before loading: ${JSON.stringify(samples)}`)
  }
  // Reattaching the outgoing editor below must preserve its original text, too.
  const ready = structuredClone(pending)
  ready.layout.groups[0].tabs.find((tab) => tab.id === incoming.id).loadingState = 'loaded'
  await execute('ComponentState.setState', baseline.uid, ready)
  await verify(1)
  await expect(page.locator('.Main .EditorContainer')).not.toHaveAttribute('inert')
  // A normal already-loaded tab switch must commit directly with no spinner.
  await execute('Main.openUri', uris[0])
  await verify(0)
  if ((await execute('GetActiveEditor.getTextDocument')).text !== contents[0]) throw new Error('Keyboard probe edited outgoing content')
  if (outgoing.editorUid === incoming.editorUid) throw new Error('Expected independent editor viewlets')
  await capture('passed')
  console.log('PASS restored file opens, repeated tab clicks, live-state inspector, and inert 100 ms paint holding')
} catch (error) {
  await capture('failed').catch(() => {})
  throw error
} finally {
  if (evidence) {
    await mkdir(evidence, { recursive: true })
    await writeFile(join(evidence, 'console.json'), JSON.stringify(diagnostics, null, 2))
  }
  if (app) {
    await app.evaluate(({ app }) => app.exit(0)).catch(() => {})
    await app.close().catch(() => {})
  }
  await rm(profile, { recursive: true, force: true })
}
