import { readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const [application, attempt] = process.argv.slice(2)
const config = join(application, 'static/config/extensions.json')
if (attempt === '0') await rm(config)

const patch = async (file, replacements) => {
  const path = join(application, file)
  let source = await readFile(path, 'utf8')
  for (const [before, after] of replacements) {
    if (source.split(before).length !== 2) throw new Error(`Expected one trace point in ${file}: ${before}`)
    source = source.replace(before, after)
  }
  await writeFile(path, source)
}

const log = (event) => `console.log('[create-json]', JSON.stringify({ time: Date.now(), ${event} }))`

const hydrate = 'const languages = await ExtensionHostLanguages.getLanguages(platform, assetDir)'
await patch('packages/renderer-worker/src/parts/Languages/Languages.js', [
  [
    hydrate,
    `${hydrate}\n  ${log("phase: 'languages', platform, count: languages.length, json: languages.some(language => language.id === 'json')")}`,
  ],
])

const update = 'const updateDiagnostics = async (editor, timeoutMs = 0) => {'
const provider = 'const message = event.data;\n        if (requestGenerations'
await patch('node_modules/@lvce-editor/editor-worker/dist/editorWorkerMain.js', [
  [
    update,
    `${update}\n  if (editor.uri.endsWith('/b.json')) ${log("phase: 'update', enabled: editor.diagnosticsEnabled, language: editor.languageId, strict: timeoutMs > 0")};`,
  ],
  [
    provider,
    `const message = event.data;\n        if (editor.uri.endsWith('/b.json')) ${log("phase: 'provider', type: message.type, providers: message.providerCount, diagnostics: message.diagnostics?.length, generation")};\n        if (requestGenerations`,
  ],
])

const runnerStart = 'const testNames = await getPaths()'
await patch('packages/extension-host-worker-tests/src/_all.js', [
  [
    runnerStart,
    `page.on('response', (response) => {
      if (new URL(response.url()).pathname.endsWith('/config/extensions.json')) {
        ${log("phase: 'manifest', status: response.status()")}
      }
    })\n    ${runnerStart}`,
  ],
])
