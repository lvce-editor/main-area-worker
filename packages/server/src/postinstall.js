import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const serverStaticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find(isCommitHash) || ''
const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const diffViewWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'diff-view', 'dist', 'diffViewWorkerMain.js')

const content = await readFile(rendererWorkerMainPath, 'utf-8')

const workerPath = join(root, '.tmp/dist/dist/mainAreaWorkerMain.js')

const remoteUrl = getRemoteUrl(workerPath)
if (!content.includes('// const mainAreaWorkerUrl = ')) {
  await cp(rendererWorkerMainPath, rendererWorkerMainPath + '.original')
  const occurrence = `const mainAreaWorkerUrl = \`\${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js\``
  const replacement = `// const mainAreaWorkerUrl = \`\${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js\`
const mainAreaWorkerUrl = \`${remoteUrl}\``

  const newContent = content.replace(occurrence, replacement)
  await writeFile(rendererWorkerMainPath, newContent)
}

const diffViewContent = await readFile(diffViewWorkerMainPath, 'utf-8')
if (!diffViewContent.includes("'DiffView.getKeyBindings'")) {
  const occurrence = `const commandMap = {
  'Diff.getCommandIds': getCommandIds,`
  if (!diffViewContent.includes(occurrence)) {
    throw new Error('diff view command map occurrence not found')
  }
  const replacement = `const getKeyBindings = () => []

const commandMap = {
  'Diff.getCommandIds': getCommandIds,
  'DiffView.getKeyBindings': getKeyBindings,`
  const newContent = diffViewContent.replace(occurrence, replacement)
  await writeFile(diffViewWorkerMainPath, newContent)
}
