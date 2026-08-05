import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-preview-tab-replaced'

interface SavedTab {
  readonly editorInput?: {
    readonly uri?: string
  }
  readonly id: number
  readonly title?: string
  readonly uri?: string
}

interface SavedGroup {
  readonly activeTabId: number
  readonly tabs: readonly SavedTab[]
}

interface SavedLayout {
  readonly groups: readonly SavedGroup[]
}

const assert: (condition: boolean, message: string) => asserts condition = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const getLayout = (savedState: unknown, label: string): SavedLayout => {
  assert(!!savedState && typeof savedState === 'object', `${label} must be an object`)
  const { layout } = savedState as { readonly layout?: unknown }
  assert(!!layout && typeof layout === 'object', `${label}.layout must be an object`)
  const { groups } = layout as { readonly groups?: unknown }
  assert(Array.isArray(groups), `${label}.layout.groups must be an array`)
  return layout as SavedLayout
}

const getActiveTab = (savedState: unknown, label: string): SavedTab => {
  const layout = getLayout(savedState, label)
  assert(layout.groups.length === 1, `Expected ${label} to contain one editor group`)
  const group = layout.groups[0]
  const activeTab = group.tabs.find((tab) => tab.id === group.activeTabId)
  assert(activeTab !== undefined, `Expected ${label} to contain its active tab`)
  return activeTab
}

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const indexFile = `${tmpDir}/index.html`
  const packageFile = `${tmpDir}/package.json`
  const viteFile = `${tmpDir}/vite.config.js`
  const viteContent =
    "import { defineConfig } from 'vite'\nimport elmPlugin from 'vite-plugin-elm'\nexport default defineConfig({ plugins: [elmPlugin()] })"
  await FileSystem.setFiles([
    { content: '<main>Elm app</main>', uri: indexFile },
    { content: '{ "scripts": { "dev": "vite" } }', uri: packageFile },
    { content: viteContent, uri: viteFile },
  ])

  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: indexFile,
    },
    focu: true,
    preview: false,
  })
  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: packageFile,
    },
    focu: true,
    preview: true,
  })
  const packageState = await Main.saveState(2)
  const activePackageTab = getActiveTab(packageState, 'packageState')

  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: viteFile,
    },
    focu: true,
    preview: true,
  })

  const indexTab = Locator('.MainTab:not(.MainTabPreview)[title$="index.html"]')
  const packageTab = Locator('.MainTab[title$="package.json"]')
  const viteTab = Locator('.MainTabPreview[title$="vite.config.js"]')
  const tabs = Locator('.MainTab')
  await expect(indexTab).toBeVisible()
  await expect(packageTab).toBeHidden()
  await expect(viteTab).toBeVisible()
  await expect(tabs).toHaveCount(2)

  const viteState = await Main.saveState(2)
  const activeViteTab = getActiveTab(viteState, 'viteState')
  assert(activeViteTab.id !== activePackageTab.id, 'Expected preview replacement to use a fresh tab id')
  assert(activeViteTab.title === 'vite.config.js', `Expected active tab title to be vite.config.js, got ${activeViteTab.title}`)
  assert(activeViteTab.uri === viteFile, `Expected active tab uri to be ${viteFile}, got ${activeViteTab.uri}`)
  assert(activeViteTab.editorInput?.uri === viteFile, `Expected active editor input uri to be ${viteFile}, got ${activeViteTab.editorInput?.uri}`)
}
