import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-preview-tab-replaced'
export const skip = ['webkit'] as const

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
    focus: true,
    preview: false,
  })
  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: packageFile,
    },
    focus: true,
    preview: true,
  })
  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: viteFile,
    },
    focus: true,
    preview: true,
  })

  const indexTab = Locator('.MainTab:not(.MainTabPreview)[title$="index.html"]')
  const packageTab = Locator('.MainTab[title$="package.json"]')
  const viteTab = Locator('.MainTabPreview[title$="vite.config.js"]')
  const selectedViteTab = Locator('.MainTabPreview.MainTabSelected[title$="vite.config.js"]')
  const tabs = Locator('.MainTab')
  await expect(indexTab).toBeVisible()
  await expect(packageTab).toBeHidden()
  await expect(viteTab).toBeVisible()
  await expect(selectedViteTab).toBeVisible()
  await expect(tabs).toHaveCount(2)
}
