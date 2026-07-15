import { runBatchedE2E } from './run-batched-e2e.js'

const excludedTests = new Set([
  'viewlet.main-area-auto-modified-status.ts',
  'viewlet.main-area-close-active-editor-saves-modified-content.ts',
  'viewlet.main-area-close-tabs-right.ts',
  'viewlet.main-area-editor-type-character.ts',
  'viewlet.main-area-focus-next-tab-cycle.ts',
  'viewlet.main-area-focus-next-tab.ts',
  'viewlet.main-area-focus-previous-tab-cycle.ts',
  'viewlet.main-area-focus-previous-tab.ts',
  'viewlet.main-area-open-css-file.ts',
  'viewlet.main-area-open-html-file.ts',
  'viewlet.main-area-open-txt-file.ts',
  'viewlet.main-area-open-uris-second-already-exists.ts',
  'viewlet.main-area-restore-closed-tab-existing-uri.ts',
  'viewlet.main-area-restore-closed-tab-middle.ts',
  'viewlet.main-area-restore-closed-tab-recreate-group.ts',
  'viewlet.main-area-restore-closed-tab-three-groups.ts',
  'viewlet.main-area-tab-switching.ts',
  'viewlet.main-area-toggle-preview-html-file.ts',
])

process.exitCode = await runBatchedE2E({
  browser: 'webkit',
  excludedTests,
  forwardedArgs: process.argv.slice(2),
  testBatchSize: 10,
})
