import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 480_000

export const instantiations = 20_000

export const instantiationsPath = join(root, 'packages', 'main-area-worker')

export const workerPath = join(root, '.tmp/dist/dist/mainAreaWorkerMain.js')

export const playwrightPath = new URL('../../e2e/node_modules/playwright/index.mjs', import.meta.url).toString()
